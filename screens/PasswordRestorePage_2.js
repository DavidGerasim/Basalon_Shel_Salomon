import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

const PasswordRestorePage_2 = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <PasswordRestorePage_2StyledContainer
        style={{ backgroundColor: "#121212" }}
      >
        <StatusBar style="light" />
        <TouchableOpacity
          onPress={() => {
            console.log("go back");
            navigation.navigate("Login"); // שינוי לפונקציה שתחזיר אותך לעמוד Login
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
            />
            <MyTextInput
              label="Confirm password"
              placeholder="Confirm your new password"
              icon="lock-closed-outline"
              isPassword={true}
            />
            <PasswordRestorePage_2StyledButton
              style={{ backgroundColor: "#8c4e79" }}
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
