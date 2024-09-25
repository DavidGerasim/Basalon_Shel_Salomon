import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  SettingsContainer,
  SettingsInnerContainer,
  SettingsAvatar,
  SettingsPageTitle,
  SettingsSubTitle,
} from "./../components/styles";
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ navigation }) => {
  const handleTitlePress = (title) => {
    console.log(`${title} pressed`);
    // Add your navigation or other logic here
  };

  return (
    <SettingsContainer>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: "absolute",
          left: 25,
          top: 100,
        }}
      >
        <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
      </TouchableOpacity>

      <SettingsInnerContainer>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <SettingsAvatar source={require("./../assets/img/img1.png")} />
          <View style={{ marginLeft: 10, flexDirection: "column" }}>
            <SettingsPageTitle
              style={{
                color: "#ffffff",
                fontSize: 18,
                marginLeft: -10,
              }}
            >
              David Gerasim
            </SettingsPageTitle>
            <SettingsSubTitle
              style={{
                color: "#bbb",
                fontSize: 14,
                marginLeft: 0,
              }}
            >
              Drum soul
            </SettingsSubTitle>
          </View>
          <Ionicons
            name="create-outline"
            size={24}
            color="#ffffff"
            style={{
              marginLeft: "auto",
              marginBottom: 40,
            }}
          />
        </View>

        <View style={{ width: "100%" }}>
          <SettingItem
            icon="call-outline"
            label="Phone Number"
            onPress={() => handleTitlePress("Phone Number")}
          />
          <SettingItem
            icon="lock-closed-outline"
            label="Password"
            onPress={() => handleTitlePress("Password")}
          />
          <SettingItem
            icon="location-outline"
            label="Address"
            onPress={() => handleTitlePress("Address")}
          />
          <SettingItem
            icon="musical-notes-outline"
            label="Main Instrument"
            onPress={() => handleTitlePress("Main Instrument")}
          />
        </View>
      </SettingsInnerContainer>
    </SettingsContainer>
  );
};

const SettingItem = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 23,
          marginLeft: 15,
        }}
      >
        <Ionicons
          name={icon}
          size={24}
          color="#ffffff"
          style={{ marginRight: 15 }}
        />
        <Text style={{ fontSize: 16, color: "#ffffff" }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Settings;
