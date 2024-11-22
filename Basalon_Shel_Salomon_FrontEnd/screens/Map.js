import React, { useState, useEffect } from "react";
import { BASE_URL } from "./../config";
import axios from "axios";
import io from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";
import { mapStyles } from "./../components/styles";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

const Map = ({ navigation }) => {
  const [gigs, setGigs] = useState([]);
  const [userGigs, setUserGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState(null);
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [userData, setUserData] = useState({
    userId: "",
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

        const data = await response.json();
        console.log("Fetched user data:", data);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status: ${response.status}`
          );
        }

        if (data && data.userId) {
          setUserData({
            userId: data.userId,
          });
          setUserGigs(data.gigs || []);
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

    const fetchGigs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/gigs`);
        const updatedGigs = response.data;
        setGigs(updatedGigs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gigs:", error);
        setLoading(false);
      }
    };
    fetchGigs();

    const socket = io(`${BASE_URL}`);
    socket.on("gigUpdated", (change) => {
      switch (change.operationType) {
        case "insert":
          setGigs((prevGigs) => [...prevGigs, change.fullDocument]);
          break;
        case "update":
          setGigs((prevGigs) =>
            prevGigs.map((gig) =>
              gig._id === change.documentKey._id
                ? { ...gig, ...change.updateDescription.updatedFields }
                : gig
            )
          );
          break;
        case "delete":
          setGigs((prevGigs) =>
            prevGigs.filter((gig) => gig._id !== change.documentKey._id)
          );
          break;
        default:
          break;
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [navigation]);

  const handleMarkerPress = (gig) => {
    setSelectedGig(gig);
  };

  const handleCloseModal = () => {
    setSelectedGig(null);
    setNumber1("");
    setNumber2("");
  };

  const handleNumberInputChange1 = (text) => {
    if (/^\d*$/.test(text)) {
      setNumber1(text);
    }
  };

  const handleNumberInputChange2 = (text) => {
    if (/^\d*$/.test(text)) {
      setNumber2(text);
    }
  };

  const isSendButtonEnabled = number1 !== "" && number2 !== "";

  const updateGig = async () => {
    if (!selectedGig) {
      console.log("No gig selected for update.");
      return;
    }

    const updatedMusicians = parseInt(number1) || 0;
    const updatedFriends = parseInt(number2) || 0;
    const musiciansCapacity =
      selectedGig.musiciansAllowed - selectedGig.musiciansCount;
    const friendsCapacity =
      selectedGig.friendsAllowed - selectedGig.friendsCount;

    if (updatedMusicians > musiciansCapacity) {
      Alert.alert(
        "Error",
        `The maximum number of musicians allowed is ${musiciansCapacity}. Please enter a smaller number.`
      );
      return;
    }

    if (updatedFriends > friendsCapacity) {
      Alert.alert(
        "Error",
        `The maximum number of friends allowed is ${friendsCapacity}. Please enter a smaller number.`
      );
      return;
    }

    try {
      const putUrl = `${BASE_URL}/api/gigs/${selectedGig._id}`;
      const gigUpdateResponse = await axios.put(putUrl, {
        userId: userData.userId,
        musiciansCount: updatedMusicians,
        friendsCount: updatedFriends,
      });
      console.log("Gig updated successfully:", gigUpdateResponse.data);

      setGigs((prevGigs) =>
        prevGigs.map((gig) =>
          gig._id === selectedGig._id
            ? { ...gig, musicians: updatedMusicians, friends: updatedFriends }
            : gig
        )
      );
      const updetedGig = {
        ...selectedGig,
        musiciansCount: (selectedGig.musiciansCount || 0) + updatedMusicians,
        friendsCount: (selectedGig.friendsCount || 0) + updatedFriends,
      };
      setSelectedGig(updetedGig);

      handleCloseModal();
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else {
        console.error("Error updating gig:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={mapStyles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleEditGig = async () => {
    if (!selectedGig) return;
    navigation.navigate("EditGig", { gig: selectedGig });
  };

  return (
    <View style={mapStyles.container}>
      <MapView
        style={mapStyles.map}
        initialRegion={{
          latitude: 31.0461,
          longitude: 34.8516,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        {gigs.map((gig, index) => {
          const latitude = parseFloat(gig.address.latitude);
          const longitude = parseFloat(gig.address.longitude);
          const isCurrentUserGig = gig.host === userData.userId;
          const isUserRegisteredForGig = userGigs.includes(gig._id);

          if (
            !isUserRegisteredForGig &&
            !isNaN(latitude) &&
            !isNaN(longitude)
          ) {
            return (
              <Marker
                key={index}
                coordinate={{ latitude, longitude }}
                pinColor={isCurrentUserGig ? "green" : "red"}
                title={gig.address.description}
                onPress={() => handleMarkerPress(gig)}
              />
            );
          }
          return null;
        })}
      </MapView>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={mapStyles.arrowButton}
      >
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>

      <Modal visible={!!selectedGig} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={mapStyles.modalContainer}>
            <View style={mapStyles.modalContent}>
              <Text style={mapStyles.modalTitle}>
                {selectedGig?.address?.description}
              </Text>
              <Text>
                Event Date:{" "}
                {selectedGig?.startTime
                  ? new Date(selectedGig.startTime).toLocaleDateString()
                  : "Invalid Date"}
              </Text>
              <Text>
                Start Time:{" "}
                {selectedGig?.startTime
                  ? new Date(selectedGig.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "No Time"}
              </Text>
              <Text>
                End Time:{" "}
                {selectedGig?.endTime
                  ? new Date(selectedGig.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "No Time"}
              </Text>
              <Text>
                Musicians:{" "}
                {selectedGig?.musiciansAllowed -
                  (selectedGig?.musiciansCount || 0)}
              </Text>
              <Text>
                Friends:{" "}
                {selectedGig?.friendsAllowed - (selectedGig?.friendsCount || 0)}
              </Text>
              <Text>Instruments: {selectedGig?.instruments}</Text>
              <Text>Comment: {selectedGig?.comment}</Text>

              {selectedGig?.host !== userData.userId && (
                <>
                  <TextInput
                    placeholder="Enter number of musicians"
                    value={number1}
                    onChangeText={handleNumberInputChange1}
                    keyboardType="numeric"
                    style={mapStyles.input}
                  />
                  <TextInput
                    placeholder="Enter number of friends"
                    value={number2}
                    onChangeText={handleNumberInputChange2}
                    keyboardType="numeric"
                    style={mapStyles.input}
                  />
                </>
              )}

              <TouchableOpacity
                onPress={
                  selectedGig?.host === userData.userId
                    ? handleEditGig
                    : updateGig
                }
                disabled={
                  !isSendButtonEnabled && selectedGig?.host !== userData.userId
                }
                style={[
                  mapStyles.sendButton,
                  {
                    opacity:
                      isSendButtonEnabled ||
                      selectedGig?.host === userData.userId
                        ? 1
                        : 0.5,
                  },
                ]}
              >
                <Text style={mapStyles.sendButtonText}>
                  {selectedGig?.host === userData.userId ? "Edit" : "Send"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={mapStyles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Map;
