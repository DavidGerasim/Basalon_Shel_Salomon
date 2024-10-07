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

  const handleInputChange = (field, value) => {
    // המרה למספר
    const numberValue = parseInt(value, 10);

    if (field === "musicians") {
      // בדוק אם הערך הוא מספר חיובי שלם
      if (value === "" || (numberValue > 0 && Number.isInteger(numberValue))) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
        console.log(`Input changed - ${field}: ${value}`);
      } else {
        // הצג התראה מיידית על קלט לא חוקי
        Alert.alert(
          "Invalid Input",
          "Please enter a positive whole number for musicians."
        );
      }
    } else if (field === "friends") {
      // בדוק אם הערך הוא מספר חיובי שלם
      if (value === "" || (numberValue >= 0 && Number.isInteger(numberValue))) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: value,
        }));
        console.log(`Input changed - ${field}: ${value}`);
      } else {
        // הצג התראה מיידית על קלט לא חוקי
        Alert.alert(
          "Invalid Input",
          "Please enter a non-negative whole number for friends."
        );
      }
    } else {
      // עבור שדות אחרים, עדכן כרגיל
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
       // טען את התוצאות מה-Nominatim
       const suggestions = response.data.map((location) => ({
         display_name: location.display_name,
         // תוכל להוסיף יותר פרטים אם צריך
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
   handleInputChange("city", address.display_name); // השתמש בשם התצוגה
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
      const response = await fetch("http://172.25.18.107:3000/api/posts", {
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

    // צור תאריך חדש שמשלב את התאריך הנבחר עם הזמן החדש
    const combinedBeginningTime = new Date(selectedDate);
    combinedBeginningTime.setHours(currentTime.getHours());
    combinedBeginningTime.setMinutes(currentTime.getMinutes());

    // Check if the combined time is after the current time
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

    // Check if the selected time is after the beginning time
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
              onLocationSelect={handleLocationSelect} // הוספת הפונקציה הזו
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
              placeholder="Choose number of musicians"
              icon="musical-notes-outline"
              value={formData.musicians}
              onChangeText={(text) => handleInputChange("musicians", text)}
              keyboardType="numeric"
            />

            {/* Friends Input */}
            <UploadingPostInputLabel>Friends</UploadingPostInputLabel>
            <MyTextInput
              placeholder="Choose number of friends"
              icon="person-outline"
              value={formData.friends}
              onChangeText={(text) => handleInputChange("friends", text)}
              keyboardType="numeric"
            />

            {/* Instruments Input */}
            <UploadingPostInputLabel>Instruments</UploadingPostInputLabel>
            <MyTextInput
              placeholder="What do you have?"
              icon="musical-notes-outline"
              value={formData.instruments}
              onChangeText={(text) => handleInputChange("instruments", text)}
            />

            {/* Comment Input */}
            <UploadingPostInputLabel>Comment</UploadingPostInputLabel>
            <MyTextInput
              placeholder="If you want..."
              icon="chatbox-outline"
              value={formData.comment}
              onChangeText={(text) => handleInputChange("comment", text)}
            />

            {/* Post Button */}
            <UploadingPostStyledButton
              onPress={handlePost}
              disabled={!isFormValid()} // Disable button if form is not valid
              style={{
                backgroundColor: isFormValid() ? "#528DD0" : "#B0C4DE", // Change color based on validity
              }}
            >
              <UploadingPostButtonText>
                {loading ? "Uploading..." : "Upload Post"}
              </UploadingPostButtonText>
            </UploadingPostStyledButton>

            {/* Message Display */}
            {message ? (
              <Text style={{ color: "green", marginTop: 10 }}>{message}</Text>
            ) : null}
          </UploadingPostFormArea>
        </UploadingPostInnerContainer>
      </ScrollView>

      {/* DateTime Picker for Date */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()} // הגדרת תאריך מקסימלי להיום
        />
      )}

      {/* DateTime Picker for Beginning Time */}
      {showBeginningPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={beginningTime}
          mode="time"
          display="default"
          onChange={onBeginningTimeChange}
        />
      )}

      {/* DateTime Picker for End Time */}
      {showEndPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={endTime}
          mode="time"
          display="default"
          onChange={onEndTimeChange}
        />
      )}
    </UploadingPostStyledContainer>
  );
};

export default UploadingPost;
