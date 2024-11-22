import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "./../config";
import {
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import {
  PasswordRestorePage_2ButtonText,
  PasswordRestorePage_2InputContainer,
  PasswordRestorePage_2InputLabel,
  PasswordRestorePage_2InnerContainer,
  PasswordRestorePage_2PageTitle,
  PasswordRestorePage_2StyledButton,
  PasswordRestorePage_2TextInputStyled,
  PasswordRestorePage_2StyledContainer,
  PasswordRestorePage_2FormArea,
} from "../components/styles";

const PasswordRestorePage_2 = ({ route, navigation }) => {
  const { email } = route.params || {}; // Get the email from the previous page
  const [userEmail, setUserEmail] = useState(email); // Store the email in state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    console.log("Email received:", userEmail);
  }, [userEmail]);

  const handleSave = async () => {
    console.log("Attempting to update password for:", userEmail);
    console.log("New password:", newPassword);
    console.log("Confirm password:", confirmPassword);

    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      console.warn("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, newPassword }),
      });

      console.log("Response status:", response.status);
      console.log("Response URL:", response.url);

      const rawResponse = await response.text();
      console.log("Raw response:", rawResponse);

      // Check if the response is JSON or HTML
      let data;
      try {
        data = JSON.parse(rawResponse);
        console.log("Parsed JSON data:", data);
      } catch (err) {
        console.error("Failed to parse response as JSON:", err);
        Alert.alert("An unexpected error occurred. Please try again.");
        return;
      }

      if (response.ok) {
        Alert.alert("Password updated successfully!");
        navigation.navigate("Login");
      } else {
        console.warn(
          "Update failed with message:",
          data.message || "Failed to update password."
        );
        Alert.alert(data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password: ", error);
      Alert.alert("An error occurred while updating the password.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <PasswordRestorePage_2StyledContainer
        style={{ backgroundColor: "#121212" }}
      >
        <StatusBar style="light" />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            position: "absolute",
            left: 10,
            top: 25,
            marginTop: 70,
          }}
        >
          <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
        </TouchableOpacity>

        <PasswordRestorePage_2PageTitle style={{ color: "#8c4e79" }}>
          Restore Your Password
        </PasswordRestorePage_2PageTitle>
        <PasswordRestorePage_2InnerContainer>
          <PasswordRestorePage_2FormArea>
            <MyTextInput
              label="New password"
              placeholder="Enter a new password"
              icon="lock-closed-outline"
              isPassword={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <MyTextInput
              label="Confirm password"
              placeholder="Confirm your new password"
              icon="lock-closed-outline"
              isPassword={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <PasswordRestorePage_2StyledButton
              style={{ backgroundColor: "#8c4e79" }}
              onPress={handleSave}
            >
              <PasswordRestorePage_2ButtonText>
                Save
              </PasswordRestorePage_2ButtonText>
            </PasswordRestorePage_2StyledButton>
          </PasswordRestorePage_2FormArea>
        </PasswordRestorePage_2InnerContainer>
      </PasswordRestorePage_2StyledContainer>
    </TouchableWithoutFeedback>
  );
};

const MyTextInput = ({ label, icon, isPassword, ...props }) => {
  const [hidePassword, setHidePassword] = useState(isPassword);

  return (
    <View>
      <PasswordRestorePage_2InputLabel>{label}</PasswordRestorePage_2InputLabel>
      <PasswordRestorePage_2InputContainer>
        <Ionicons name={icon} size={24} color="#9CA3AF" />
        <PasswordRestorePage_2TextInputStyled
          {...props}
          secureTextEntry={hidePassword}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </PasswordRestorePage_2InputContainer>
    </View>
  );
};

export default PasswordRestorePage_2;
