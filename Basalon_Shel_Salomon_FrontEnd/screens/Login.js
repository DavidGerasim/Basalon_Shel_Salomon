import React, { useState } from "react";
import { BASE_URL } from "./../config";
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
      const requestBody = JSON.stringify({ email: normalizedEmail, password });
      const response = await fetch(`${BASE_URL}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (response.ok) {
        if (data.message === "Signin successful") {
          console.log("User logged in successfully:", data);
          await AsyncStorage.setItem("token", data.token);

          navigation.navigate("Welcome");
        } else {
          console.error("Login failed with message:", data.message);
          Alert.alert("Login Error", data.message);
        }
      } else {
        console.error("Response not OK:", response.status);
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
