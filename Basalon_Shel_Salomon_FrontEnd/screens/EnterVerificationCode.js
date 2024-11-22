import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import {
  PasswordRestorePage_2StyledContainer,
  PasswordRestorePage_2InnerContainer,
  PasswordRestorePage_2PageTitle,
  PasswordRestorePage_2FormArea,
  PasswordRestorePage_2InputContainer,
  PasswordRestorePage_2InputLabel,
  PasswordRestorePage_2TextInputStyled,
  PasswordRestorePage_2StyledButton,
  PasswordRestorePage_2ButtonText,
} from "../components/styles";

const EnterVerificationCode = ({ route, navigation }) => {
  const { email, sentCode } = route.params;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  console.log("Received email:", email);
  console.log("Received sentCode:", sentCode);

  const handleVerifyCode = () => {
    console.log("Entered code:", code);
    if (code === sentCode) {
      console.log("Code verified successfully.");
      navigation.navigate("PasswordRestorePage_2", {
        email: email,
      });
    } else {
      setError("Invalid code. Please try again.");
      console.log("Verification failed. Code did not match.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <PasswordRestorePage_2StyledContainer>
        <StatusBar style="light" />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 25, top: 130 }}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <PasswordRestorePage_2PageTitle>
          Enter Verification Code
        </PasswordRestorePage_2PageTitle>
        <PasswordRestorePage_2InnerContainer>
          <PasswordRestorePage_2FormArea>
            <View>
              <PasswordRestorePage_2InputLabel>
                Enter the verification code sent to your email:
              </PasswordRestorePage_2InputLabel>
              <PasswordRestorePage_2InputContainer>
                <PasswordRestorePage_2TextInputStyled
                  placeholder="Enter 5-digit code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                />
              </PasswordRestorePage_2InputContainer>
            </View>
            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
            <PasswordRestorePage_2StyledButton onPress={handleVerifyCode}>
              <PasswordRestorePage_2ButtonText>
                Verify Code
              </PasswordRestorePage_2ButtonText>
            </PasswordRestorePage_2StyledButton>
          </PasswordRestorePage_2FormArea>
        </PasswordRestorePage_2InnerContainer>
      </PasswordRestorePage_2StyledContainer>
    </TouchableWithoutFeedback>
  );
};

export default EnterVerificationCode;
