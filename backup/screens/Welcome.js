import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
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
    // Fetch user data from the database
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://10.0.0.14:3000/user/profile"); // Change to your actual endpoint
        const data = await response.json();
        
        // Assuming your API returns an object with firstName and lastName
        if (data) {
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <WelcomeInnerContainer>
        <WelcomeImageContainer>
          {/* כפתור פעמון */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("NotificationIcon");
            }}
            style={{ position: "absolute", top: 40, right: 75 }}
          >
            <Ionicons name="notifications-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          {/* כפתור חזרה */}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ position: "absolute", top: 40, left: 20 }}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          {/* כפתור הגדרות */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Settings");
            }}
            style={{ position: "absolute", top: 40, right: 25 }}
          >
            <Ionicons name="settings-outline" size={30} color="#ffffff" />
          </TouchableOpacity>
        </WelcomeImageContainer>

        {/* כותרת Welcome */}
        <WelcomePageTitle>Welcome</WelcomePageTitle>

        {/* תמונת פרופיל */}
        <WelcomeAvatar
          resizeMode="cover"
          source={require("./../assets/img/img1.png")}
        />

        {/* שם המשתמש */}
        <WelcomeSubTitle>{userData.firstName} {userData.lastName}</WelcomeSubTitle>

        {/* מיכל הטופס */}
        <WelcomeContainer>
          <WelcomeStyledFormArea>
            <WelcomeChoosinglTitle style={{ marginTop: -30 }}>
              What do you choose to be today?
            </WelcomeChoosinglTitle>
            <WelcomeLine />
            <ButtonContainer>
              <WelcomeStyledButton
                onPress={() => {
                  navigation.navigate("UploadingPost");
                }}
              >
                <WelcomeButtonText>Host</WelcomeButtonText>
              </WelcomeStyledButton>
              <WelcomeStyledButton
                onPress={() => {
                  navigation.navigate("Map");
                }}
              >
                <WelcomeButtonText>Guest</WelcomeButtonText>
              </WelcomeStyledButton>
            </ButtonContainer>
          </WelcomeStyledFormArea>
        </WelcomeContainer>
      </WelcomeInnerContainer>
    </>
  );
};

export default Welcome;
