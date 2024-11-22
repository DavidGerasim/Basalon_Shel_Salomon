import React, { useEffect, useState } from "react";
import { BASE_URL } from "./../config";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Modal,
  Alert,
} from "react-native";
import { notificationStyles } from "./../components/styles";

const NotificationIcon = ({ navigation }) => {
  const initialLayout = { width: Dimensions.get("window").width };
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "hosted", title: "You are hosting" },
    { key: "guested", title: "You are guesting at" },
  ]);
  const [userData, setUserData] = useState({ userId: "" });
  const [hostedGigs, setHostedGigs] = useState([]);
  const [selectedGigParticipants, setSelectedGigParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedGigId, setSelectedGigId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [guestedGigs, setGuestedGigs] = useState([]);
  const [hostPhoneNumbers, setHostPhoneNumbers] = useState({});

  const handleGigPress = async (gigId) => {
    setSelectedGigId(gigId);
    const participants = await fetchGigParticipants(gigId);
    setSelectedGigParticipants(participants);
    setModalVisible(true);
  };

  // Delete gig function
  const deleteGig = async (gigId, isHost) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/gigs/${gigId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isHost }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Gig deleted successfully");
        if (isHost) {
          // Hosted gig deleted completely
          setHostedGigs(hostedGigs.filter((gig) => gig._id !== gigId));
        } else {
          // Guested gig deleted just for the user
          setGuestedGigs(guestedGigs.filter((gig) => gig._id !== gigId));
        }
      } else {
        Alert.alert("Error", result.message || "Failed to delete gig");
      }
    } catch (error) {
      console.error("Error deleting gig:", error);
      Alert.alert("Error", "An error occurred while deleting the gig");
    }
  };

  const confirmDeleteGig = (gigId, isHost) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this gig?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => deleteGig(gigId, isHost) },
      ],
      { cancelable: true }
    );
  };

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
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status: ${response.status}`
          );
        }

        setUserData({ userId: data.userId });
        await fetchUserGigs(data.userId);
        await fetchGuestedGigs(data.userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserGigs = async (userId) => {
      try {
        const hostedResponse = await fetch(
          `${BASE_URL}/api/gigs/host/${userId}`
        );
        let hostedGigsData = await hostedResponse.json();

        hostedGigsData.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        );

        setHostedGigs(hostedGigsData);
      } catch (error) {
        console.error("Error fetching hosted gigs:", error);
      }
    };

    // Fetch gigs the user is guesting at based on gig IDs in userData.gigs
    const fetchGuestedGigs = async (userId) => {
      try {
        const guestedResponse = await fetch(
          `${BASE_URL}/api/gigs/guest/${userId}`
        );
        let guestedGigsData = await guestedResponse.json();

        // Creating an object to store phone numbers for each gig
        const phoneNumbers = {};
        guestedGigsData.forEach((gig) => {
          if (gig.host && gig.host.phoneNumber) {
            phoneNumbers[gig._id] = gig.host.phoneNumber;
          } else {
            console.log(`No host or phone number for gig with ID: ${gig._id}`);
          }
        });
        setHostPhoneNumbers(phoneNumbers);

        console.log(guestedGigsData);
        setGuestedGigs(guestedGigsData);
      } catch (error) {
        console.error("Error fetching guested gigs:", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchGigGuests = async (gigId, userId) => {
    const token = await AsyncStorage.getItem("token");
    const url = `${BASE_URL}/api/mapping/${gigId}/${userId}`;
    console.log("url:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(`Failed to fetch user data. Status: ${response.status}`);
    }
    return data;
  };

  const fetchGigParticipants = async (gigId) => {
    try {
      console.log("Fetching all users and checking for gigId:", gigId);
      const token = await AsyncStorage.getItem("token");
      console.log("Retrieved token:", token ? "Available" : "Not available");

      if (!token) {
        throw new Error("Token not available");
      }

      // Fetch all users
      const usersResponse = await fetch(`${BASE_URL}/user/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "Received response for users with status:",
        usersResponse.status
      );
      if (!usersResponse.ok) {
        throw new Error(
          `Failed to fetch users. Status: ${usersResponse.status} ${usersResponse.statusText}`
        );
      }

      const users = await usersResponse.json();
      console.log("User data fetched:", users);

      const participants = [];

      // Check each user for gig participation
      for (const user of users) {
        if (user.gigs && user.gigs.includes(gigId)) {
          console.log(
            "User is a participant in gigId:",
            gigId,
            "User data:",
            user
          );

          const gigGuests = await fetchGigGuests(gigId, user._id);
          user.musiciansCount = gigGuests.musiciansCount;
          user.friendsCount = gigGuests.friendsCount;
          participants.push(user);
        } else {
          console.log(
            "User is not a participant in gigId:",
            gigId,
            "User data:",
            user
          );
        }
      }

      console.log("Participants found:", participants);

      return participants;
    } catch (error) {
      console.error("Error fetching gig participants:", error);
      return [];
    }
  };

  // Guested gigs route display
  const GuestedGigsRoute = () => (
    <ScrollView>
      <View style={notificationStyles.hostedGigsContainer}>
        {guestedGigs.length > 0 ? (
          guestedGigs.map((gig) => (
            <TouchableOpacity key={gig._id} style={notificationStyles.gigCard}>
              <View style={{ flex: 1 }}>
                <Text style={notificationStyles.gigTextBold}>
                  Date: {new Date(gig.startTime).toLocaleDateString()}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Location: {gig.address?.description || "No address provided"}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Start Time:{" "}
                  {new Date(gig.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={notificationStyles.gigText}>
                  End Time:{" "}
                  {new Date(gig.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Instruments: {gig.instruments || "Not specified"}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Comment: {gig.comment || "No comment"}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Phone Number: {hostPhoneNumbers[gig._id] || "Loading..."}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => confirmDeleteGig(gig._id, false)} // Pass false for guest
                style={notificationStyles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={notificationStyles.emptyText}>Empty</Text>
        )}
      </View>
    </ScrollView>
  );

  // Hosted gigs route display
  const HostedGigsRoute = () => (
    <ScrollView>
      <View style={notificationStyles.hostedGigsContainer}>
        {hostedGigs.length > 0 ? (
          hostedGigs.map((gig) => (
            <TouchableOpacity
              key={gig._id}
              style={notificationStyles.gigCard}
              onPress={() => handleGigPress(gig._id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={notificationStyles.gigTextBold}>
                  Date: {new Date(gig.startTime).toLocaleDateString()}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Location: {gig.address.description}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Start Time:{" "}
                  {new Date(gig.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={notificationStyles.gigText}>
                  End Time:{" "}
                  {new Date(gig.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Comment: {gig.comment}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Instruments: {gig.instruments}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Musicians Allowed: {gig.musiciansAllowed}
                </Text>
                <Text style={notificationStyles.gigText}>
                  Friends Allowed: {gig.friendsAllowed}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => confirmDeleteGig(gig._id, true)}
                style={notificationStyles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={notificationStyles.emptyText}>Empty</Text>
        )}

        {selectedGigId && selectedGigParticipants.length > 0 && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={notificationStyles.modalOverlay}>
              <View style={notificationStyles.modalContent}>
                <Text style={notificationStyles.modalTitle}>Participants:</Text>
                {selectedGigParticipants.map((participant) => (
                  <View key={participant._id} style={{ marginTop: 10 }}>
                    <Text>
                      {participant.firstName} {participant.lastName}
                    </Text>
                    <Text>Phone number: {participant.phoneNumber}</Text>
                    <Text>Musicians: {participant.musiciansCount ?? 0}</Text>
                    <Text>Friends: {participant.friendsCount ?? 0}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={notificationStyles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={notificationStyles.modalCloseButtonText}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    guested: GuestedGigsRoute,
    hosted: HostedGigsRoute,
  });

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <View style={{ flex: 1, marginTop: 80 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={notificationStyles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
          </TouchableOpacity>
          <Text style={notificationStyles.pageTitle}>List</Text>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={notificationStyles.tabIndicator}
                style={notificationStyles.tabBar}
                labelStyle={notificationStyles.tabLabel}
              />
            )}
            style={notificationStyles.tabViewContainer}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationIcon;
