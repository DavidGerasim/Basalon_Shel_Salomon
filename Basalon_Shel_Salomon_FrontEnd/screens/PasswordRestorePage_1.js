import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "./../config";
import {
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import {
  PasswordRestorePage_1ButtonText,
  PasswordRestorePage_1InputContainer,
  PasswordRestorePage_1InputLabel,
  PasswordRestorePage_1InnerContainer,
  PasswordRestorePage_1PageTitle,
  PasswordRestorePage_1StyledButton,
  PasswordRestorePage_1TextInputStyled,
  PasswordRestorePage_1StyledContainer,
  PasswordRestorePage_1FormArea,
} from "../components/styles";

const PasswordRestorePage_1 = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/resetPassword`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          "Code sent! Check your email for the verification code."
        );

        navigation.navigate("EnterVerificationCode", {
          email,
          sentCode: response.data.code,
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSuccessMessage("An error occurred. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <PasswordRestorePage_1StyledContainer
        style={{ backgroundColor: "#121212" }}
      >
        <StatusBar style="light" />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 25, top: 130 }}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <PasswordRestorePage_1PageTitle style={{ color: "#8c4e79" }}>
          Restore Your Password
        </PasswordRestorePage_1PageTitle>
        <PasswordRestorePage_1InnerContainer>
          <PasswordRestorePage_1FormArea>
            <MyTextInput
              label="Email address"
              placeholder="Enter your email address"
              icon="mail-outline"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {successMessage ? (
              <Text style={{ color: "green" }}>{successMessage}</Text>
            ) : null}
            <PasswordRestorePage_1StyledButton
              onPress={handleResetPassword}
              style={{ backgroundColor: "#8c4e79" }}
            >
              <PasswordRestorePage_1ButtonText>
                Send
              </PasswordRestorePage_1ButtonText>
            </PasswordRestorePage_1StyledButton>
          </PasswordRestorePage_1FormArea>
        </PasswordRestorePage_1InnerContainer>
      </PasswordRestorePage_1StyledContainer>
    </TouchableWithoutFeedback>
  );
};

const MyTextInput = ({ label, icon, ...props }) => {
  return (
    <View>
      <PasswordRestorePage_1InputLabel>{label}</PasswordRestorePage_1InputLabel>
      <PasswordRestorePage_1InputContainer>
        <Ionicons name={icon} size={24} color="#9CA3AF" />
        <PasswordRestorePage_1TextInputStyled {...props} />
      </PasswordRestorePage_1InputContainer>
    </View>
  );
};

export default PasswordRestorePage_1;
