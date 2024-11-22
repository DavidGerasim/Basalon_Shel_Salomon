import React, { useEffect, useState } from "react";
import { BASE_URL } from "./../config";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [userData, setUserData] = useState({
    userId: "",
  });

  const [formData, setFormData] = useState({
    city: "",
    musicians: "",
    friends: "",
    instruments: "",
    comment: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status: ${response.status}`
          );
        }

        if (data && data.userId) {
          setUserData({
            userId: data.userId,
          });
        } else {
          Alert.alert("Authentication Error", "You are not logged in.");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "An error occurred while fetching user data.");
        navigation.navigate("Login");
      }
    };

    fetchUserData();
  }, [navigation]);

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

  const handlePost = async () => {
    if (!userData.userId) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
    setLoading(true);
    setMessage("");

    const postData = {
      host: userData.userId,
      address: formData.city,
      startTime: beginningTime.toISOString(),
      endTime: endTime.toISOString(),
      musiciansAllowed: formData.musicians,
      friendsAllowed: formData.friends,
      instruments: formData.instruments,
      comment: formData.comment,
    };

    console.log("Post data:", postData);

    try {
      const response = await fetch(`${BASE_URL}/api/gigs`, {
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

        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigation.navigate("Welcome");
        }, 2000);
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
              style={{
                backgroundColor: loading || !isFormValid() ? "grey" : "blue",
              }}
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
        <ModalBackground>
          <ModalContainer>
            <ModalText>Post uploaded successfully!</ModalText>
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

export default UploadingPost;
