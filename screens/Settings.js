import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
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
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ navigation }) => {
  const [isPhoneModalVisible, setPhoneModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [isMainInstrumentModalVisible, setMainInstrumentModalVisible] =
    useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newMainInstrument, setNewMainInstrument] = useState("");
  const [profileImage, setProfileImage] = useState(""); // State for profile image
  const [userData, setUserData] = useState({}); // State for user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token:", token); // Check token

        const response = await fetch("http://172.25.18.107:3000/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Fetched user data:", data);

        setUserData(data); // Update state with user data
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "An error occurred while fetching user data.");
        navigation.navigate("Login"); // Navigate to login if error occurs
      }
    };

    fetchUserData();
  }, [navigation]);

  // פונקציה לעדכון פרטי המשתמש בשרת
  const updateUserDetails = async (field, value) => {
    try {
      const token = await AsyncStorage.getItem("token"); // קבלת הטוקן מהאחסון המקומי
      const response = await fetch(`http://172.25.18.107:3000/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // הוספת טוקן לאימות
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }), // שליחת השדה המעודכן
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update ${field}. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(`${field} updated successfully:`, data);

      // עדכון הפרטים המקומיים לאחר שהבקשה לשרת הצליחה
      setUserData((prevUserData) => ({
        ...prevUserData,
        [field]: value,
      }));

      Alert.alert("Success", `${field} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      Alert.alert("Error", `Failed to update ${field}.`);
    }
  };

  const handleProfileImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Update profile image state
    }
  };

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
            <SettingsAvatar
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("./../assets/img/img1.png")
              }
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 10 }}>
            <SettingsPageTitle>
              {userData.firstName} {userData.lastName}
            </SettingsPageTitle>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <SettingItem
            icon="call-outline"
            label="Phone Number"
            onPress={() => setPhoneModalVisible(true)}
          />
          <SettingItem
            icon="lock-closed-outline"
            label="Password"
            onPress={() => setPasswordModalVisible(true)}
          />
          <SettingItem
            icon="location-outline"
            label="Address"
            onPress={() => setAddressModalVisible(true)}
          />
          <SettingItem
            icon="musical-notes-outline"
            label="Main Instrument"
            onPress={() => setMainInstrumentModalVisible(true)}
          />
        </View>
      </SettingsInnerContainer>

      {/* Phone Number Update Modal */}
      <Modal visible={isPhoneModalVisible} animationType="slide" transparent>
        <ModalSettingsContainer>
          <ModalContent>
            <ModalTitle>Update Phone Number</ModalTitle>
            <ModalInput
              placeholder="Enter new phone number"
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              keyboardType="phone-pad"
            />
            <ModalButton
              onPress={() => {
                updateUserDetails("phoneNumber", newPhoneNumber); // עדכון מספר הטלפון
                setPhoneModalVisible(false); // סגירת המודל לאחר העדכון
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Update</Text>
            </ModalButton>
            <TouchableOpacity onPress={() => setPhoneModalVisible(false)}>
              <Text style={{ color: "#007BFF" }}>Cancel</Text>
            </TouchableOpacity>
          </ModalContent>
        </ModalSettingsContainer>
      </Modal>

      {/* Password Update Modal */}
      <Modal visible={isPasswordModalVisible} animationType="slide" transparent>
        <ModalSettingsContainer>
          <ModalContent>
            <ModalTitle>Update Password</ModalTitle>
            <ModalInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />
            <ModalButton
              onPress={() => {
                updateUserDetails("password", newPassword); // עדכון הסיסמה
                setPasswordModalVisible(false);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Update</Text>
            </ModalButton>

            <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
              <Text style={{ color: "#007BFF" }}>Cancel</Text>
            </TouchableOpacity>
          </ModalContent>
        </ModalSettingsContainer>
      </Modal>

      {/* Address Update Modal */}
      <Modal visible={isAddressModalVisible} animationType="slide" transparent>
        <ModalSettingsContainer>
          <ModalContent>
            <ModalTitle>Update Address</ModalTitle>
            <ModalInput
              placeholder="Enter new address"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <ModalButton
              onPress={() => {
                updateUserDetails("address", newAddress); // עדכון הכתובת
                setAddressModalVisible(false);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Update</Text>
            </ModalButton>

            <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
              <Text style={{ color: "#007BFF" }}>Cancel</Text>
            </TouchableOpacity>
          </ModalContent>
        </ModalSettingsContainer>
      </Modal>

      {/* Main Instrument Update Modal */}
      <Modal
        visible={isMainInstrumentModalVisible}
        animationType="slide"
        transparent
      >
        <ModalSettingsContainer>
          <ModalContent>
            <ModalTitle>Update Main Instrument</ModalTitle>
            <ModalInput
              placeholder="Enter new main instrument"
              value={newMainInstrument}
              onChangeText={setNewMainInstrument}
            />
            <ModalButton
              onPress={() => {
                updateUserDetails("main instrument", newMainInstrument);
                setAddressModalVisible(false);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Update</Text>
            </ModalButton>
            <TouchableOpacity
              onPress={() => setMainInstrumentModalVisible(false)}
            >
              <Text style={{ color: "#007BFF" }}>Cancel</Text>
            </TouchableOpacity>
          </ModalContent>
        </ModalSettingsContainer>
      </Modal>
    </SettingsContainer>
  );
};

const SettingItem = ({ icon, label, onPress }) => (
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

export default Settings;
