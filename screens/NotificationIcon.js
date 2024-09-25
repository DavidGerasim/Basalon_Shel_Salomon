import React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, TouchableOpacity } from "react-native";
import {
  NotificationContainer,
  NotificationInnerContainer,
  NotificationPageTitle,
  NotificationItemContainer,
  NotificationText,
  NotificationStyledFormArea,
  NotificationTouchable,
  NotificationArrowIconContainer,
} from "./../components/styles";

const NotificationIcon = ({ navigation }) => {
  const notifications = [
    { id: 1, text: "Hosting request from User A" },
    { id: 2, text: "Hosting request from User B" },
    { id: 3, text: "Hosting request from User C" },
    // Add more notifications as needed
  ];

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212", borderWidth: 1, borderColor: 'red'}}>
        <NotificationInnerContainer style={{ marginTop: 80 }}>
          {/* Back Icon */}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack(); // פעולה לחזרה לעמוד הקודם
            }}
            style={{
              position: "absolute",
              left: 10,
              top: 25,
              borderWidth: 1,
              borderColor: "red",
            }}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          {/* Page Title */}
          <NotificationPageTitle style={{borderWidth: 1, borderColor: 'red'}}>Notifications</NotificationPageTitle>

          <NotificationStyledFormArea style={{borderWidth: 1, borderColor: 'red'}}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationTouchable
                  onPress={() => {
                    console.log(
                      "Navigating to notification details:",
                      notification.id
                    );
                  }}
                >
                  <NotificationItemContainer>
                    <NotificationText>{notification.text}</NotificationText>
                    {/* Arrow on the right side */}
                    <NotificationArrowIconContainer>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={24}
                        color="#ffffff"
                      />
                    </NotificationArrowIconContainer>
                  </NotificationItemContainer>
                </NotificationTouchable>
              </React.Fragment>
            ))}
          </NotificationStyledFormArea>
        </NotificationInnerContainer>
      </SafeAreaView>
    </>
  );
};

export default NotificationIcon;
