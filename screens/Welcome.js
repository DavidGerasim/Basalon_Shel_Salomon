import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  WelcomeInnerContainer,
  WelcomePageTitle,
  WelcomeSubTitle,
  WelcomeChoosinglTitle,
  WelcomeStyledFormArea,
  WelcomeStyledButton,
  WelcomeButtonText,
  WelcomeLine,
  WelcomeContainer,
  WelcomeAvatar,
  ButtonContainer,
  WelcomeImageContainer,
} from "./../components/styles";

const Welcome = ({ navigation }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token:", token); // לוודא שהטוקן נכון

        const response = await fetch("http://172.25.18.107:3000/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // וודא שהכותרת נכונה
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status); // בדיקת קוד הסטטוס
        const responseText = await response.text();
        console.log("Raw response text:", responseText); // הצגת התשובה המלאה מהשרת

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status: ${response.status}`
          );
        }

        const data = JSON.parse(responseText);
        console.log("Fetched user data:", data);

        if (data && data.firstName && data.lastName) {
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
          });
        } else {
          Alert.alert("Authentication Error", "You are not logged in.");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "An error occurred while fetching user data.");
        navigation.navigate("Login");
      }
    };

    fetchUserData();
  }, [navigation]);

  return (
    <>
      <StatusBar style="light" />
      <WelcomeInnerContainer>
        <WelcomeImageContainer>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("NotificationIcon");
            }}
            style={{ position: "absolute", top: 40, right: 75 }}
          >
            <Ionicons name="notifications-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={{ position: "absolute", top: 40, left: 20 }}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Settings");
            }}
            style={{ position: "absolute", top: 40, right: 25 }}
          >
            <Ionicons name="settings-outline" size={30} color="#ffffff" />
          </TouchableOpacity>
        </WelcomeImageContainer>

        <WelcomePageTitle>Welcome</WelcomePageTitle>

        <WelcomeAvatar
          resizeMode="cover"
          source={require("./../assets/img/img1.png")}
        />

        <WelcomeSubTitle>
          {userData.firstName} {userData.lastName}
        </WelcomeSubTitle>

        <WelcomeChoosinglTitle>
          Where would you like to go?
        </WelcomeChoosinglTitle>

        <WelcomeStyledFormArea>
          <ButtonContainer>
            <WelcomeStyledButton
              style={{ backgroundColor: "#8c4e79" }}
              onPress={() => navigation.navigate("UploadPost")}
            >
              <WelcomeButtonText>Upload a post</WelcomeButtonText>
            </WelcomeStyledButton>
            <WelcomeStyledButton
              style={{ backgroundColor: "#8c4e79" }}
              onPress={() => navigation.navigate("Map")}
            >
              <WelcomeButtonText>Map</WelcomeButtonText>
            </WelcomeStyledButton>
          </ButtonContainer>
        </WelcomeStyledFormArea>
        <WelcomeLine />
      </WelcomeInnerContainer>
    </>
  );
};

export default Welcome;
