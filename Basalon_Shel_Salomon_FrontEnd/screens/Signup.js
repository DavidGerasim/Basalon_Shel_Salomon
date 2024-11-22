import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { BASE_URL } from "./../config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TouchableOpacity, ScrollView, Text } from "react-native";
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
  styles,
} from "./../components/styles";

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const signUp = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/signup`, {
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
          await AsyncStorage.setItem("token", result.token);
          navigation.navigate("Welcome", {
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
        } else {
          setErrorMessage(result.message);
          setTimeout(() => setErrorMessage(""), 3000);
        }
      } else {
        const text = await response.text();
        setErrorMessage("Unexpected response: " + text);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Error during signup: " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <SignupStyledContainer>
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
      <SignupPageTitle>Sign Up</SignupPageTitle>

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
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
            />
            <MyTextInput
              label="Confirm Password"
              placeholder="Confirm Your password"
              icon="lock-closed-outline"
              isPassword={true}
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              togglePasswordVisibility={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
            <MyTextInput
              label="Phone Number"
              placeholder="Write Your Phone number"
              icon="call-outline"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
            />
            <SignupStyledButton onPress={signUp}>
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
              name={props.secureTextEntry ? "eye-off" : "eye"}
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
