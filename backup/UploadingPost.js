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

  const [showBeginningPicker, setShowBeginningPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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
    console.log(`Input changed - ${field}: ${value}`); // לוג של שינויים בשדות
  };

  const handleLocationChange = async (value) => {
    handleInputChange("city", value);

    // Fetch location suggestions from Google Places API
    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${GOOGLE_PLACES_API_KEY}`
        );
        setLocationSuggestions(response.data.predictions);
        setShowSuggestions(true);
        console.log("Location suggestions fetched:", response.data.predictions); // לוג של הצעות למיקום
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
    console.log(`Location selected: ${address}`); // לוג של המיקום הנבחר
  };

  const handlePost = async () => {
    setLoading(true);
    setMessage("");

    // המרת השעות לאובייקטים של תאריך
    const postData = {
      city: formData.city,
      beginningTime: beginningTime.toISOString(),
      endTime: endTime.toISOString(),
      musicians: formData.musicians,
      friends: formData.friends,
      instruments: formData.instruments,
      comment: formData.comment,
    };

    console.log("Post data:", postData); // לוג של הנתונים שנשלחים ב-POST

    try {
      const response = await fetch("http://172.25.18.98:3000/api/posts", {
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
        console.log("Post uploaded successfully!"); // לוג של הצלחה
      } else {
        Alert.alert(
          "Error",
          `Failed to upload post. Status: ${response.status}. Message: ${responseBody}`
        );
        console.error("Failed to upload post:", responseBody); // לוג של שגיאה
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
    console.log("Beginning time changed:", currentTime); // לוג של שינוי הזמן ההתחלתי
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndPicker(false);
    setEndTime(currentTime);
    console.log("End time changed:", currentTime); // לוג של שינוי הזמן הסופי
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
            <LocationInput
              address={formData.city}
              onLocationChange={(value) => handleLocationChange(value)}
            />

            <TouchableOpacity onPress={() => setShowBeginningPicker(true)}>
              <MyTextInput
                label="Beginning Time"
                placeholder={beginningTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                icon="time-outline"
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <MyTextInput
                label="End Time"
                placeholder={endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                icon="time-outline"
                editable={false}
              />
            </TouchableOpacity>

            <MyTextInput
              label="Musicians"
              placeholder="Choose a number of musicians"
              icon="musical-notes-outline"
              value={formData.musicians}
              onChangeText={(text) => handleInputChange("musicians", text)}
              keyboardType="numeric"
            />
            <MyTextInput
              label="Friends"
              placeholder="Choose a number of friends"
              icon="people-outline"
              value={formData.friends}
              onChangeText={(text) => handleInputChange("friends", text)}
              keyboardType="numeric"
            />
            <MyTextInput
              label="Instruments"
              placeholder="What musical instrument do you have?"
              icon="musical-notes-outline"
              value={formData.instruments}
              onChangeText={(text) => handleInputChange("instruments", text)}
            />
            <MyTextInput
              label="Comment"
              placeholder="Comment"
              icon="chatbox-outline"
              value={formData.comment}
              onChangeText={(text) => handleInputChange("comment", text)}
            />

            <UploadingPostStyledButton
              style={{ backgroundColor: "#34D399" }}
              onPress={handlePost}
              disabled={loading}
            >
              <UploadingPostButtonText>
                {loading ? "Uploading..." : "Post"}
              </UploadingPostButtonText>
            </UploadingPostStyledButton>

            {message ? <Text style={{ color: "white" }}>{message}</Text> : null}
          </UploadingPostFormArea>
        </UploadingPostInnerContainer>
      </ScrollView>

      {showBeginningPicker && (
        <DateTimePicker
          value={beginningTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onBeginningTimeChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onEndTimeChange}
        />
      )}
    </UploadingPostStyledContainer>
  );
};

const MyTextInput = ({ label, icon, isPassword, ...props }) => {
  return (
    <View>
      <UploadingPostInputLabel>{label}</UploadingPostInputLabel>
      <UploadingPostInputContainer>
        <Ionicons name={icon} size={24} color="#ffffff" />
        <UploadingPostTextInputStyled {...props} />
      </UploadingPostInputContainer>
    </View>
  );
};

export default UploadingPost;
