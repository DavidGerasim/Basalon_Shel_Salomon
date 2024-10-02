import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
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

const GOOGLE_PLACES_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY";

const UploadingPost = ({ navigation }) => {
  const [beginningTime, setBeginningTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // סטייט לתאריך

  const [showBeginningPicker, setShowBeginningPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // סטייט לפתיחת בחירת תאריך

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

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    console.log(`Input changed - ${field}: ${value}`);
  };

  const handleLocationChange = async (value) => {
    handleInputChange("city", value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${GOOGLE_PLACES_API_KEY}`
        );
        setLocationSuggestions(response.data.predictions);
        setShowSuggestions(true);
        console.log("Location suggestions fetched:", response.data.predictions);
      } catch (error) {
        console.error("Error fetching location suggestions: ", error);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (address) => {
    handleInputChange("city", address);
    setShowSuggestions(false);
    console.log(`Location selected: ${address}`);
  };

  const handlePost = async () => {
    setLoading(true);
    setMessage("");

    const postData = {
      city: formData.city,
      date: selectedDate.toISOString(), // הוספת תאריך לנתוני ה-POST
      beginningTime: beginningTime.toISOString(),
      endTime: endTime.toISOString(),
      musicians: formData.musicians,
      friends: formData.friends,
      instruments: formData.instruments,
      comment: formData.comment,
    };

    console.log("Post data:", postData);

    try {
      const response = await fetch("http://10.0.0.14:3000/api/posts", {
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
    setBeginningTime(currentTime);
    console.log("Beginning time changed:", currentTime);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndPicker(false);
    setEndTime(currentTime);
    console.log("End time changed:", currentTime);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    console.log("Selected date:", currentDate); // לוג של תאריך נבחר
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
              placeholder="Choose a number of musicians"
              icon="musical-notes-outline"
              value={formData.musicians}
              onChangeText={(text) => handleInputChange("musicians", text)}
              keyboardType="numeric"
            />

            {/* Friends Input */}
            <UploadingPostInputLabel>Friends</UploadingPostInputLabel>
            <MyTextInput
              placeholder="Choose a number of friends"
              icon="people-outline"
              value={formData.friends}
              onChangeText={(text) => handleInputChange("friends", text)}
              keyboardType="numeric"
            />

            {/* Instruments Input */}
            <UploadingPostInputLabel>Instruments</UploadingPostInputLabel>
            <MyTextInput
              placeholder="What musical instrument do you have?"
              icon="musical-notes-outline"
              value={formData.instruments}
              onChangeText={(text) => handleInputChange("instruments", text)}
            />

            {/* Comment Input */}
            <UploadingPostInputLabel>Comment</UploadingPostInputLabel>
            <MyTextInput
              placeholder="Comment"
              icon="chatbox-outline"
              value={formData.comment}
              onChangeText={(text) => handleInputChange("comment", text)}
            />

            {/* Post Button */}
            <UploadingPostStyledButton
              style={{ marginTop: 10 }}
              onPress={handlePost}
              disabled={loading}
            >
              <UploadingPostButtonText>
                {loading ? "Loading..." : "Post"}
              </UploadingPostButtonText>
            </UploadingPostStyledButton>
          </UploadingPostFormArea>
        </UploadingPostInnerContainer>
      </ScrollView>

      {/* Time Pickers */}
      {showBeginningPicker && (
        <DateTimePicker
          value={beginningTime}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={onBeginningTimeChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          is24Hour={true}
          onChange={onEndTimeChange}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange} // מעדכן את התאריך הנבחר
        />
      )}
    </UploadingPostStyledContainer>
  );
};

const MyTextInput = ({ label, icon, ...props }) => {
  return (
    <UploadingPostInputContainer>
      <Row>
        <Ionicons name={icon} size={24} color="#ffffff" />
        <UploadingPostInputLabel>{label}</UploadingPostInputLabel>
      </Row>
      <UploadingPostTextInputStyled {...props} />
    </UploadingPostInputContainer>
  );
};

export default UploadingPost;
