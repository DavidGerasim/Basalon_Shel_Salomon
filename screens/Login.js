import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
          />
          <MyTextInput
            label="Password"
            placeholder="password"
            icon="lock-closed-outline"
            isPassword={true}
            hidePassword={hidePassword}
            setHidePassword={setHidePassword}
          />
          <TouchableOpacity onPress={() => navigation.navigate("PasswordRestorePage_1")}>
            <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
          </TouchableOpacity>
          <LoginStyledButton
            style={{ backgroundColor: "#8c4e79" }}
            onPress={() => navigation.navigate("Welcome")}
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
