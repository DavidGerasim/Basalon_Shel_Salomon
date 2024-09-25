import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

const Signup = ({ navigation }) => {
  const handleImageUpload = () => {
    // הוסף את הקוד הנדרש להעלאת תמונה
  };

  return (
    <SignupStyledContainer style={{ backgroundColor: "#121212" }}>
      <StatusBar style="light" />
      <TouchableOpacity
        onPress={() => {
          console.log("go back");
          navigation.goBack();
        }}
        style={{
          position: "absolute",
          left: 25,
          top: 100,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>
      <SignupPageTitle
        style={{ color: "#8c4e79",}}
      >
        Sign Up
      </SignupPageTitle>
      <ScrollView>
        <SignupInnerContainer>
          <SignupFormArea>
            <MyTextInput
              label="First Name"
              placeholder="Write your First Name"
              icon="person-outline"
            />
            <MyTextInput
              label="Last Name"
              placeholder="Write your Last Name"
              icon="person-outline"
            />
            <MyTextInput
              label="Address"
              placeholder="Write Your Address"
              icon="location-outline"
            />
            <MyTextInput
              label="Email Address"
              placeholder="example@gmail.com"
              icon="mail-outline"
            />
            <MyTextInput
              label="Password"
              placeholder="password"
              icon="lock-closed-outline"
              isPassword={true}
            />
            <MyTextInput
              label="Confirm Password"
              placeholder="Confirm Your password"
              icon="lock-closed-outline"
              isPassword={true}
            />
            <MyTextInput
              label="Phone Number"
              placeholder="Write Your Phone number"
              icon="call-outline"
            />
            <MyTextInput
              label="Main Instrument"
              placeholder="Write Your Main Instrument"
              icon="musical-notes-outline"
            />
            <ProfileImageContainer>
              <Button
                title="Upload Profile Picture"
                onPress={handleImageUpload}
              />
            </ProfileImageContainer>
            <SignupStyledButton style={{ backgroundColor: "#8c4e79" }}>
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
