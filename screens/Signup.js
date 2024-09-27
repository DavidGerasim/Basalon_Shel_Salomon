import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
  FlatList,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import {
  SignupStyledContainer,
  SignupInnerContainer,
  SignupPageTitle,
  SignupFormArea,
  SignupInputContainer,
  SignupTextInputStyled,
  SignupInputLabel,
  SignupStyledButton,
  SignupButtonText,
  ProfileImageContainer,
} from "./../components/styles";

import LocationInput from "../components/LocationInputView";

const GOOGLE_PLACES_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY";

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    mainInstrument: "",
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleImageUpload = async () => { }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLocationChange = async (value) => {
    handleInputChange("address", value);

    // Fetch location suggestions from Google Places API
    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${GOOGLE_PLACES_API_KEY}`
        );
        setLocationSuggestions(response.data.predictions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions: ", error);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (address) => {
    handleInputChange("address", address);
    setShowSuggestions(false);
  };

  const signUp = async () => {
    try {
      // Prepare the form data
      console.log(JSON.stringify(formData));
      // Make sure you're hitting the correct route (e.g., /signup)
      const response = await fetch('http://192.168.1.130:3000/user/signup', {  // Add the correct signup endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Send form data in JSON format
      });
  
      // Check if the response is JSON before parsing
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();  // Parse the JSON response
  
        // Handle the response
        if (result.status === 'SUCCESS') {
          console.log('Signup successful:', result.message);
          // Optionally navigate to another screen, reset the form, etc.
        } else {
          console.error('Signup failed:', result.message);
        }
      } else {
        // If the response is not JSON, log the text response for debugging
        const text = await response.text();
        console.error('Unexpected response:', text);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  

  return (
    <SignupStyledContainer style={{ backgroundColor: "#121212" }}>
      <StatusBar style="light" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          left: 25,
          top: 100,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>
      <SignupPageTitle style={{ color: "#8c4e79" }}>Sign Up</SignupPageTitle>
      <ScrollView>
        <SignupInnerContainer>
          <SignupFormArea>
            <MyTextInput
              label="First Name"
              placeholder="Write your First Name"
              icon="person-outline"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange("firstName", value)}
            />
            <MyTextInput
              label="Last Name"
              placeholder="Write your Last Name"
              icon="person-outline"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange("lastName", value)}
            />
            <MyTextInput
              label="Email Address"
              placeholder="example@gmail.com"
              icon="mail-outline"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
            <MyTextInput
              label="Password"
              placeholder="password"
              icon="lock-closed-outline"
              isPassword={true}
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
            />
            <MyTextInput
              label="Confirm Password"
              placeholder="Confirm Your password"
              icon="lock-closed-outline"
              isPassword={true}
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
            />
            <MyTextInput
              label="Phone Number"
              placeholder="Write Your Phone number"
              icon="call-outline"
              value={formData.phoneNumber}
              onChangeText={(value) =>
                handleInputChange("phoneNumber", value)
              }
            />
            <MyTextInput
              label="Main Instrument"
              placeholder="Write Your Main Instrument"
              icon="musical-notes-outline"
              value={formData.mainInstrument}
              onChangeText={(value) =>
                handleInputChange("mainInstrument", value)
              }
            />
            <LocationInput
                  address={formData.address}
                  onLocationChange={(value) => handleInputChange("address", value)}
                />
            <ProfileImageContainer>
              <Button title="Upload Profile Picture" onPress={handleImageUpload} />
            </ProfileImageContainer>
            <SignupStyledButton
              onPress={signUp}
              style={{ backgroundColor: "#8c4e79" }}
            >
              <SignupButtonText>Sign up</SignupButtonText>
            </SignupStyledButton>
          </SignupFormArea>
        </SignupInnerContainer>
      </ScrollView>
    </SignupStyledContainer>
  );
};

const MyTextInput = ({ label, icon, isPassword, ...props }) => {
  return (
    <View>
      <SignupInputLabel>{label}</SignupInputLabel>
      <SignupInputContainer>
        <Ionicons name={icon} size={24} color="#9CA3AF" />
        <SignupTextInputStyled {...props} secureTextEntry={isPassword} />
        {isPassword && <Ionicons name="eye-off" size={24} color="#9CA3AF" />}
      </SignupInputContainer>
    </View>
  );
};

export default Signup;
