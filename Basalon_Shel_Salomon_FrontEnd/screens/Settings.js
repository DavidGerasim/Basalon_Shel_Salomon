import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "./../config";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import {
  SettingsContainer,
  SettingsInnerContainer,
  SettingsAvatar,
  SettingsPageTitle,
  ModalSettingsContainer,
  ModalContent,
  ModalTitle,
  ModalInput,
  ModalButton,
} from "./../components/styles";

const Settings = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    profilePicture: "",
  });

  const openModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token fetched:", token);

        const response = await fetch(`${BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetched User Data:", data);

        if (response.ok) {
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            password: data.password,
            profilePicture: data.profilePicture || "",
          });
        } else {
          console.error("Error fetching user data:", data.message);
          Alert.alert("Error", data.message || "Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Could not fetch user data");
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);
      console.log("Current Field:", currentField);
      console.log("Value to Update:", userData[currentField]);

      if (!currentField) {
        console.log("No field selected for update.");
        Alert.alert("Error", "Please select a field to update.");
        return;
      }

      const response = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: currentField,
          value: userData[currentField],
        }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        Alert.alert("Success", `${currentField} updated successfully`);
        setModalVisible(false);
      } else {
        Alert.alert("Error", data.message || "Failed to update information");
      }
    } catch (error) {
      Alert.alert("Error", "Could not update information");
    }
  };

  const fullImageUrl = `${BASE_URL}/${userData.profilePicture.replace(
    /\\/g,
    "/"
  )}`;

  console.log("The full image URL is:", fullImageUrl);

  const uploadProfileImage = async (uri) => {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePicture", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      console.log("Uploading profile image URI:", uri);
      const response = await fetch(`${BASE_URL}/user/profile/image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload profile image");

      console.log("Profile image uploaded successfully");
      Alert.alert("Success", "Profile image updated successfully");

      setUserData((prev) => ({ ...prev, profilePicture: uri }));
    } catch (error) {
      console.error("Error uploading profile image:", error);
      Alert.alert("Error", "Failed to upload profile image");
    }
  };

  const handleProfileImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (!uri) {
        console.error("Error: Image URI is undefined.");
        Alert.alert("Error", "Image URI is undefined.");
        return;
      }
      console.log("Selected Image URI:", uri);
      setUserData((prev) => ({ ...prev, profilePicture: uri }));
      uploadProfileImage(uri);
    }
  };

  const SettingItem = ({ label, field }) => (
    <TouchableOpacity onPress={() => openModal(field)}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 23,
          marginLeft: 15,
        }}
      >
        <Ionicons
          name={
            field === "firstName"
              ? "person-outline"
              : field === "lastName"
              ? "person-outline"
              : field === "phoneNumber"
              ? "call-outline"
              : "lock-closed-outline"
          }
          size={24}
          color="#ffffff"
          style={{ marginRight: 15 }}
        />
        <Text style={{ fontSize: 16, color: "#ffffff" }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SettingsContainer>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", left: 25, top: 100 }}
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
          <TouchableOpacity onPress={handleProfileImagePick}>
            <SettingsAvatar source={{ uri: fullImageUrl }} />
          </TouchableOpacity>
          <View style={{ marginLeft: 10 }}>
            <SettingsPageTitle>{`${userData.firstName} ${userData.lastName}`}</SettingsPageTitle>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          {["firstName", "lastName", "password", "phoneNumber"].map((field) => (
            <TouchableOpacity key={field} onPress={() => openModal(field)}>
              <SettingItem
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                field={field}
              />
            </TouchableOpacity>
          ))}
        </View>
      </SettingsInnerContainer>

      {/* Modal לעדכון */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <ModalSettingsContainer>
          <ModalContent>
            <ModalTitle>
              Update{" "}
              {currentField.charAt(0).toUpperCase() + currentField.slice(1)}
            </ModalTitle>
            <TextInput
              style={ModalInput}
              placeholder={`Enter new ${currentField}`}
              value={userData[currentField]}
              onChangeText={(text) =>
                setUserData((prev) => ({
                  ...prev,
                  [currentField]: text,
                }))
              }
              secureTextEntry={currentField === "password"}
            />
            <View style={{ marginTop: 10 }}></View>
            <ModalButton onPress={handleUpdate}>
              <Text style={{ color: "#fff", fontSize: 16 }}>Update</Text>
            </ModalButton>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 15 }}
            >
              <Text style={{ color: "#007BFF" }}>Cancel</Text>
            </TouchableOpacity>
          </ModalContent>
        </ModalSettingsContainer>
      </Modal>
    </SettingsContainer>
  );
};

export default Settings;
