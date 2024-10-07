import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LoginStyledContainer,
  LoginInnerContainer,
  LoginPageTitle,
  LoginFormArea,
  LoginInputContainer,
  LoginTextInputStyled,
  LoginInputLabel,
  ForgotPasswordText,
  LoginStyledButton,
  LoginButtonText,
  SocialLoginText,
  SocialLoginContainer,
  SocialIcon,
  LoginSignUpLink,
} from "./../components/styles";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const normalizedEmail = email.toLowerCase();
      console.log("Logging in with email:", normalizedEmail); // Log email

      const requestBody = JSON.stringify({ email: normalizedEmail, password });
      console.log("Request Body:", requestBody); // Log the request body

      const response = await fetch("http://172.25.18.107:3000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const textResponse = await response.text(); // Read response as text
      console.log("Raw response:", textResponse); // Print raw response

      const data = JSON.parse(textResponse); // Parse JSON
      console.log("Response data:", data);

      if (response.ok) {
        // Check if the response status is OK (status code 200-299)
        if (data.message === "Signin successful") {
          console.log("User logged in successfully:", data);
          await AsyncStorage.setItem("token", data.token);

          // Log before navigating to Welcome
          console.log("Navigating to Welcome screen with:", {
            firstName: data.firstName,
            lastName: data.lastName,
          });

          // Navigate to Welcome
          navigation.navigate("Welcome", {
            firstName: data.firstName,
            lastName: data.lastName,
          });
        } else {
          console.error("Login failed with message:", data.message); // Log the failure message
          Alert.alert("Login Error", data.message);
        }
      } else {
        console.error("Response not OK:", response.status); // Log if the response is not OK
        Alert.alert("Login Error", "Server error, please try again later.");
      }
    } catch (error) {
      console.error("Error during login: ", error);
      Alert.alert("Login Error", "An error occurred while logging in");
    }
  };

  return (
    <LoginStyledContainer style={{ backgroundColor: "#121212" }}>
      <StatusBar style="light" />
      <LoginInnerContainer>
        <LoginPageTitle style={{ color: "#8c4e79", marginTop: 40 }}>
          Log In
        </LoginPageTitle>
        <LoginFormArea style={{ marginTop: 90 }}>
          <MyTextInput
            label="Email Address"
            placeholder="example@gmail.com"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
          />
          <MyTextInput
            label="Password"
            placeholder="password"
            icon="lock-closed-outline"
            isPassword={true}
            hidePassword={hidePassword}
            setHidePassword={setHidePassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("PasswordRestorePage_1")}
          >
            <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
          </TouchableOpacity>
          <LoginStyledButton
            style={{ backgroundColor: "#8c4e79" }}
            onPress={handleLogin}
          >
            <LoginButtonText>Log in</LoginButtonText>
          </LoginStyledButton>
        </LoginFormArea>
        <SocialLoginText style={{ color: "#bbb", marginTop: 50 }}>
          Or continue with
        </SocialLoginText>
        <SocialLoginContainer>
          <SocialIcon source={require("./../assets/img/google.png")} />
          <SocialIcon source={require("./../assets/img/facebook.png")} />
          <SocialIcon source={require("./../assets/img/instagram.png")} />
        </SocialLoginContainer>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Text style={{ color: "#fff" }}>Don’t have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <LoginSignUpLink>Sign Up</LoginSignUpLink>
          </TouchableOpacity>
        </View>
      </LoginInnerContainer>
    </LoginStyledContainer>
  );
};

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <LoginInputLabel>{label}</LoginInputLabel>
      <LoginInputContainer>
        <Ionicons name={icon} size={24} color="#9CA3AF" />
        <LoginTextInputStyled
          {...props}
          secureTextEntry={isPassword && hidePassword}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{ position: "absolute", right: 20 }}
          >
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </LoginInputContainer>
    </View>
  );
};

export default Login;
