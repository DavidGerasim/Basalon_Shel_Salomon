import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity, ScrollView } from "react-native";
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
} from "./../components/styles";

import LocationInput from "../components/LocationInputView";

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

  const [showPassword, setShowPassword] = useState(false); // מצב לסיסמה
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // מצב לאישור הסיסמה

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLocationChange = async (value) => {
    handleInputChange("address", value);

    // Fetch location suggestions from OpenStreetMap API
    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5`
        );
        setLocationSuggestions(response.data);
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
    handleInputChange("address", address.display_name);
    setShowSuggestions(false);
  };

  const signUp = async () => {
    try {
      console.log(JSON.stringify(formData));
      const response = await fetch("http://172.25.18.108:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (result.status === "SUCCESS") {
          console.log("Signup successful:", result.message);
          // מעביר את השם ושם המשפחה
          navigation.navigate("Welcome", {
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
        } else {
          console.error("Signup failed:", result.message);
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response:", text);
      }
    } catch (error) {
      console.error("Error during signup:", error);
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
              secureTextEntry={!showPassword} // משתמש במצב
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              togglePasswordVisibility={() => setShowPassword(!showPassword)} // פונקציה לשינוי מצב
            />
            <MyTextInput
              label="Confirm Password"
              placeholder="Confirm Your password"
              icon="lock-closed-outline"
              isPassword={true}
              secureTextEntry={!showConfirmPassword} // משתמש במצב
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              togglePasswordVisibility={() =>
                setShowConfirmPassword(!showConfirmPassword)
              } // פונקציה לשינוי מצב
            />
            <MyTextInput
              label="Phone Number"
              placeholder="Write Your Phone number"
              icon="call-outline"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
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

const MyTextInput = ({
  label,
  icon,
  isPassword,
  togglePasswordVisibility,
  ...props
}) => {
  return (
    <View>
      <SignupInputLabel>{label}</SignupInputLabel>
      <SignupInputContainer>
        <Ionicons name={icon} size={24} color="#9CA3AF" />
        <SignupTextInputStyled {...props} />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={props.secureTextEntry ? "eye-off" : "eye"} // שינוי בין עין פתוחה לסגורה
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </SignupInputContainer>
    </View>
  );
};

export default Signup;
