import React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  ConfirmRejectInnerContainer,
  ConfirmRejectContainer,
  ConfirmRejectSubTitle,
  ConfirmRejectStyledFormArea,
  ConfirmRejectStyledButton,
  ConfirmRejectButtonText,
  ConfirmRejectAvatar,
  ConfirmRejectButtonContainer,
  ConfirmRejectSettingsIcon,
  ConfirmRejectText,
} from "./../components/styles";

const ConfirmReject = ({ navigation }) => {
  return (
    <>
      <StatusBar style="light" />
      <ConfirmRejectInnerContainer>
        {/* איקון חזור */}
        <ConfirmRejectSettingsIcon
          onPress={() => {
            navigation.goBack();
          }}
          style={{ left: 25, top: 70 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#ffffff" />
        </ConfirmRejectSettingsIcon>

        {/* התמונה, שם המשתמש והטקסטים */}
        <ConfirmRejectContainer>
          <ConfirmRejectAvatar
            resizeMode="cover"
            source={require("./../assets/img/img1.png")}
          />
          <ConfirmRejectSubTitle>David Gerasim</ConfirmRejectSubTitle>

          <ConfirmRejectStyledFormArea>
            <ConfirmRejectText>Wants to come to you:</ConfirmRejectText>
            <ConfirmRejectText>Date: September 21, 2024</ConfirmRejectText>
            <ConfirmRejectText>Time: 18:30 - 20:30</ConfirmRejectText>
            <ConfirmRejectText>Playing on: Guitar</ConfirmRejectText>
            <ConfirmRejectText>Coming with someone? 3 frinds</ConfirmRejectText>

            {/* כפתורי אישור ודחייה */}
            <ConfirmRejectButtonContainer>
              <ConfirmRejectStyledButton
                onPress={() => {
                  // הגדרת הפעולה כשרוצים לאשר
                }}
                style={{ backgroundColor: "#4CAF50" }}
              >
                <ConfirmRejectButtonText>Confirm</ConfirmRejectButtonText>
              </ConfirmRejectStyledButton>
              <ConfirmRejectStyledButton
                onPress={() => {
                  // הגדרת הפעולה כשרוצים לדחות
                }}
                style={{ backgroundColor: "#F44336" }}
              >
                <ConfirmRejectButtonText>Reject</ConfirmRejectButtonText>
              </ConfirmRejectStyledButton>
            </ConfirmRejectButtonContainer>
          </ConfirmRejectStyledFormArea>
        </ConfirmRejectContainer>
      </ConfirmRejectInnerContainer>
    </>
  );
};

export default ConfirmReject;
