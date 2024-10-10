import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Header,
  Row,
  UploadingPostStyledContainer,
  UploadingPostInnerContainer,
  UploadingPostPageTitle,
  UploadingPostFormArea,
  UploadingPostInputContainer,
  UploadingPostTextInputStyled,
  UploadingPostInputLabel,
  UploadingPostStyledButton,
  UploadingPostButtonText,
} from "./../components/styles";
import axios from "axios";
import LocationInput from "../components/LocationInputView";
import MyTextInput from "../components/MyTextInput"; // ודא שכתובת זו נכונה

const UploadingPost = ({ navigation }) => {
  const [beginningTime, setBeginningTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showBeginningPicker, setShowBeginningPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    city: "",
    musicians: "",
    friends: "",
    instruments: "",
    comment: "",
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (field, value) => {
    const numberValue = parseInt(value, 10);

    if (field === "musicians") {
      if (value === "" || (numberValue > 0 && Number.isInteger(numberValue))) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
        console.log(`Input changed - ${field}: ${value}`);
      } else {
        Alert.alert(
          "Invalid Input",
          "Please enter a positive whole number for musicians."
        );
      }
    } else if (field === "friends") {
      if (value === "" || (numberValue >= 0 && Number.isInteger(numberValue))) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
        console.log(`Input changed - ${field}: ${value}`);
      } else {
        Alert.alert(
          "Invalid Input",
          "Please enter a non-negative whole number for friends."
        );
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }));
      console.log(`Input changed - ${field}: ${value}`);
    }
  };

  const handleLocationChange = async (value) => {
    handleInputChange("city", value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`
        );
        const suggestions = response.data.map((location) => ({
          display_name: location.display_name,
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

  const handlePost = async () => {
    setLoading(true);
    setMessage("");

    const postData = {
      city: formData.city,
      date: selectedDate.toISOString(),
      beginningTime: beginningTime.toISOString(),
      endTime: endTime.toISOString(),
      musicians: formData.musicians,
      friends: formData.friends,
      instruments: formData.instruments,
      comment: formData.comment,
    };

    console.log("Post data:", postData);

    try {
      const response = await fetch("http://10.0.0.9:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const responseBody = await response.text();

      if (response.ok) {
        setMessage("Post uploaded successfully!");
        setFormData({
          city: "",
          musicians: "",
          friends: "",
          instruments: "",
          comment: "",
        });
        console.log("Post uploaded successfully!");

        // Show success message for 3 seconds
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigation.navigate("Welcome"); // Navigate back to the welcome screen
        }, 3000);
      } else {
        Alert.alert(
          "Error",
          `Failed to upload post. Status: ${response.status}. Message: ${responseBody}`
        );
        console.error("Failed to upload post:", responseBody);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
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
      console.log("Beginning time changed:", currentTime);
    } else {
      Alert.alert("Invalid Time", "Beginning time cannot be in the past.");
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndPicker(false);

    if (currentTime > beginningTime) {
      setEndTime(currentTime);
      console.log("End time changed:", currentTime);
    } else {
      Alert.alert("Invalid Time", "End time must be after beginning time.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);

    setSelectedDate(currentDate);
    console.log("Selected date:", currentDate);
  };

  const isFormValid = () => {
    return (
      formData.city &&
      selectedDate &&
      beginningTime &&
      endTime &&
      formData.musicians &&
      formData.friends
    );
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
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={{
              position: "absolute",
              top: 38,
              right: 0,
            }}
          >
            <Ionicons name="settings-outline" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <UploadingPostInnerContainer>
          <UploadingPostPageTitle>Post Publication</UploadingPostPageTitle>
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

            {/* Musicians Input */}
            <UploadingPostInputLabel>Musicians</UploadingPostInputLabel>
            <MyTextInput
              placeholder="Musicians"
              value={formData.musicians}
              onChangeText={(value) => handleInputChange("musicians", value)}
              keyboardType="numeric"
            />

            {/* Friends Input */}
            <UploadingPostInputLabel>Friends</UploadingPostInputLabel>
            <MyTextInput
              placeholder="Friends"
              value={formData.friends}
              onChangeText={(value) => handleInputChange("friends", value)}
              keyboardType="numeric"
            />

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
              onPress={handlePost}
              disabled={loading || !isFormValid()}
            >
              <UploadingPostButtonText>
                {loading ? "Posting..." : "Post"}
              </UploadingPostButtonText>
            </UploadingPostStyledButton>
          </UploadingPostFormArea>
        </UploadingPostInnerContainer>
      </ScrollView>

      {/* Success Message Modal */}
      <Modal visible={showSuccessMessage} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Post uploaded successfully!
            </Text>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
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

export default UploadingPost;
