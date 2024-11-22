import React, { useEffect, useState } from "react";
import { BASE_URL } from "./../config";
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
  WelcomeAvatar,
  ButtonContainer,
  WelcomeImageContainer,
} from "./../components/styles";

const Welcome = ({ navigation }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    profilePicture: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const responseText = await response.text();

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
            profilePicture: data.profilePicture
              ? `${BASE_URL}/${data.profilePicture.replace(/\\/g, "/")}`
              : null,
          });
          console.log("The full image URL is:", data.profilePicture);
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
            <Ionicons name="list-outline" size={30} color="#ffffff" />
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
          source={{ uri: userData.profilePicture }}
        />

        <WelcomeSubTitle>
          {userData.firstName} {userData.lastName}
        </WelcomeSubTitle>

        <WelcomeChoosinglTitle>Choose</WelcomeChoosinglTitle>

        <WelcomeStyledFormArea>
          <ButtonContainer>
            <WelcomeStyledButton
              style={{ backgroundColor: "#8c4e79" }}
              onPress={() => navigation.navigate("UploadingPost")}
            >
              <WelcomeButtonText>Host</WelcomeButtonText>
            </WelcomeStyledButton>
            <WelcomeStyledButton
              style={{ backgroundColor: "#8c4e79" }}
              onPress={() => navigation.navigate("Map")}
            >
              <WelcomeButtonText>Guest</WelcomeButtonText>
            </WelcomeStyledButton>
          </ButtonContainer>
        </WelcomeStyledFormArea>
      </WelcomeInnerContainer>
    </>
  );
};

export default Welcome;
