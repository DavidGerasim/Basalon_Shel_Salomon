import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [errorMessage, setErrorMessage] = useState(""); // state להודעת השגיאה

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
      const response = await fetch("http://172.25.18.107:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (response.ok) {
          console.log("Signup successful:", result.message);
          await AsyncStorage.setItem("token", result.token);
          // מעביר את השם ושם המשפחה
          navigation.navigate("Welcome", {
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
        } else {
          setErrorMessage(result.message); // הגדרת הודעת השגיאה מהשרת
          setTimeout(() => setErrorMessage(""), 3000); // מחיקה לאחר 3 שניות
        }
      } else {
        const text = await response.text();
        setErrorMessage("Unexpected response: " + text);
        setTimeout(() => setErrorMessage(""), 3000); // מחיקה לאחר 3 שניות
      }
    } catch (error) {
      setErrorMessage("Error during signup: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000); // מחיקה לאחר 3 שניות
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

      {/* הודעת השגיאה */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

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

// סגנון להודעת השגיאה
const styles = StyleSheet.create({
  errorContainer: {
    position: "absolute",
    top: 350,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  errorText: {
    backgroundColor: "red",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
});

export default Signup;
