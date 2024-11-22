import React, { useState } from "react";
import { BASE_URL } from "./../config";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import LocationInput from "../components/LocationInputView";
import MyTextInput from "../components/MyTextInput";
import { View, TouchableOpacity, ScrollView, Alert, Modal } from "react-native";

import {
  UploadingPostStyledContainer,
  UploadingPostInnerContainer,
  UploadingPostPageTitle,
  UploadingPostFormArea,
  UploadingPostInputLabel,
  UploadingPostStyledButton,
  UploadingPostButtonText,
  ModalBackground,
  ModalContainer,
  ModalText,
} from "./../components/styles";

const EditGig = ({ route, navigation }) => {
  const { gig } = route.params;
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(gig.startTime));
  const [beginningTime, setBeginningTime] = useState(new Date(gig.startTime));
  const [endTime, setEndTime] = useState(new Date(gig.endTime));
  const [instruments, setInstruments] = useState(gig.instruments || "");
  const [comment, setComment] = useState(gig.comment || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBeginningPicker, setShowBeginningPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    city: gig.address.description,
    latitude: gig.address.latitude,
    longitude: gig.address.longitude,
    instruments: gig.instruments || "",
    comment: gig.comment || "",
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleLocationChange = async (value) => {
    handleInputChange("city", value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://geocode.search.hereapi.com/v1/geocode?q=${value}&apiKey=4bFTytZDyahavdUEDNn_Y7_jkBl78wsqrCdR84MWLHU`
        );
        const suggestions = response.data.items.map((item) => ({
          display_name: item.address.label,
          latitude: item.position.lat,
          longitude: item.position.lng,
        }));

        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
        console.log("Location suggestions fetched:", suggestions);
      } catch (error) {
        console.error("Error fetching location suggestions: ", error);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (address) => {
    handleInputChange("city", address.display_name);
    setShowSuggestions(false);
    console.log(`Location selected: ${address.display_name}`);
  };

  const handleInputChange = (field, value) => {
    console.log(`Input changed for ${field}:`, value);
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    const updatedAddress =
      formData.city && formData.latitude && formData.longitude
        ? {
            description: formData.city,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }
        : gig.address;

    const updatedData = {
      address: updatedAddress,
      startTime: beginningTime.toISOString(),
      endTime: endTime.toISOString(),
      instruments: formData.instruments,
      comment: formData.comment,
    };

    const gigId = gig._id;
    try {
      const response = await fetch(`${BASE_URL}/api/gigs/update/${gigId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const responseBody = await response.text();

      if (response.ok) {
        setMessage("Gig updated successfully!");
        setFormData({
          city: "",
          instruments: "",
          comment: "",
        });

        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigation.navigate("Map");
        }, 1500);
      } else {
        console.error("Failed to update gig:", response.status);
        Alert.alert(
          "Error",
          `Failed to update gig. Status: ${response.status}. Message: ${responseBody}`
        );
      }
    } catch (error) {
      console.error("Error updating gig:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onBeginningTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || beginningTime;
    setShowBeginningPicker(false);

    const combinedBeginningTime = new Date(selectedDate);
    combinedBeginningTime.setHours(currentTime.getHours());
    combinedBeginningTime.setMinutes(currentTime.getMinutes());

    if (combinedBeginningTime > new Date()) {
      setBeginningTime(currentTime);
    } else {
      Alert.alert("Invalid Time", "Beginning time cannot be in the past.");
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndPicker(false);

    if (currentTime > beginningTime) {
      setEndTime(currentTime);
    } else {
      Alert.alert("Invalid Time", "End time must be after beginning time.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);

    setSelectedDate(currentDate);

    const newBeginningTime = new Date(currentDate);
    newBeginningTime.setHours(beginningTime.getHours());
    newBeginningTime.setMinutes(beginningTime.getMinutes());

    const newEndTime = new Date(currentDate);
    newEndTime.setHours(endTime.getHours());
    newEndTime.setMinutes(endTime.getMinutes());

    setBeginningTime(newBeginningTime);
    setEndTime(newEndTime);
  };

  const isFormValid = () => {
    return formData.city && selectedDate && beginningTime && endTime;
  };

  return (
    <UploadingPostStyledContainer style={{ paddingTop: 80 }}>
      <StatusBar style="light" />
      <ScrollView>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              top: 36,
              left: 0,
            }}
          >
            <Ionicons name="arrow-back" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <UploadingPostInnerContainer>
          <UploadingPostPageTitle>Edit Gig</UploadingPostPageTitle>
          <UploadingPostFormArea>
            {/* Location Input */}
            <UploadingPostInputLabel></UploadingPostInputLabel>
            <LocationInput
              address={formData.city}
              onLocationChange={(value) => handleLocationChange(value)}
              onLocationSelect={handleLocationSelect}
            />
            {/* Date Picker Input */}
            <UploadingPostInputLabel>Select Date</UploadingPostInputLabel>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <MyTextInput
                placeholder={selectedDate.toLocaleDateString()}
                icon="calendar-outline"
                editable={false}
              />
            </TouchableOpacity>
            {/* Beginning Time Input */}
            <UploadingPostInputLabel>Beginning Time</UploadingPostInputLabel>
            <TouchableOpacity onPress={() => setShowBeginningPicker(true)}>
              <MyTextInput
                placeholder={beginningTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                icon="time-outline"
                editable={false}
              />
            </TouchableOpacity>
            {/* End Time Input */}
            <UploadingPostInputLabel>End Time</UploadingPostInputLabel>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <MyTextInput
                placeholder={endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                icon="time-outline"
                editable={false}
              />
            </TouchableOpacity>
            {/* Instruments Input */}
            <UploadingPostInputLabel>Instruments</UploadingPostInputLabel>
            <MyTextInput
              placeholder="Instruments"
              value={formData.instruments}
              onChangeText={(value) => handleInputChange("instruments", value)}
            />
            {/* Comment Input */}
            <UploadingPostInputLabel>Comment</UploadingPostInputLabel>
            <MyTextInput
              placeholder="Comment"
              value={formData.comment}
              onChangeText={(value) => handleInputChange("comment", value)}
              multiline={true}
            />
            {/* Submit Button */}
            <UploadingPostStyledButton
              onPress={handleUpdate}
              disabled={loading || !isFormValid()}
              style={{
                backgroundColor: loading || !isFormValid() ? "grey" : "green",
              }}
            >
              <UploadingPostButtonText>
                {loading ? "Posting..." : "Update"}
              </UploadingPostButtonText>
            </UploadingPostStyledButton>
          </UploadingPostFormArea>
        </UploadingPostInnerContainer>
      </ScrollView>
      {/* Success Message Modal */}
      <Modal visible={showSuccessMessage} animationType="slide" transparent>
        <ModalBackground>
          <ModalContainer>
            <ModalText>Gig updated successfully!</ModalText>
          </ModalContainer>
        </ModalBackground>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showBeginningPicker && (
        <DateTimePicker
          value={beginningTime}
          mode="time"
          display="default"
          onChange={onBeginningTimeChange}
          is24Hour={true}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={onEndTimeChange}
          is24Hour={true}
        />
      )}
    </UploadingPostStyledContainer>
  );
};

export default EditGig;
