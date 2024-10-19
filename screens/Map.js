import React, { useState, useEffect } from "react";
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
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { mapStyles } from "./../components/styles";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Map = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [userData, setUserData] = useState({
    userId: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch("http://10.0.0.9:3000/user/profile", {
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

        if (data && data.userId) {
          setUserData({
            userId: data.userId,
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

    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://10.0.0.9:3000/api/posts");

        const currentTime = new Date();
        const updatedPosts = response.data.filter((post) => {
          const eventDate = new Date(post.date);
          const postStartTime = new Date(post.beginningTime);

          return (
            post.musicians > 0 &&
            eventDate >= new Date().setHours(0, 0, 0, 0) &&
            (eventDate > currentTime ||
              (eventDate.toDateString() === currentTime.toDateString() &&
                postStartTime >= currentTime))
          );
        });

        setPosts(updatedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();

    const socket = io("http://10.0.0.9:3000");
    socket.on("postUpdated", (change) => {
      switch (change.operationType) {
        case "insert":
          setPosts((prevPosts) => [...prevPosts, change.fullDocument]);
          break;
        case "update":
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === change.documentKey._id
                ? { ...post, ...change.updateDescription.updatedFields }
                : post
            )
          );
          break;
        case "delete":
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== change.documentKey._id)
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

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://10.0.0.9:3000/api/posts/${postId}`);
    } catch (error) {}
  };

  const handleMarkerPress = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
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

  const updatePost = async () => {
    if (!selectedPost) {
      return;
    }

    const updatedMusicians = Math.max(
      0,
      selectedPost.musicians - (parseInt(number1) || 0)
    );
    const updatedFriends = Math.max(
      0,
      selectedPost.friends - (parseInt(number2) || 0)
    );

    const meetingData = {
      userId: userData.userId,
      city: selectedPost.city,
      latitude: parseFloat(selectedPost.city.latitude),
      longitude: parseFloat(selectedPost.city.longitude),
      date: selectedPost.date,
      beginningTime: selectedPost.beginningTime,
      endTime: selectedPost.endTime,
      musicians: updatedMusicians,
      friends: updatedFriends,
      instruments: selectedPost.instruments,
      comment: selectedPost.comment,
    };

    try {
      await axios.post("http://10.0.0.9:3000/api/meetings", meetingData);
      await axios.put(`http://10.0.0.9:3000/api/posts/${selectedPost._id}`, {
        musicians: updatedMusicians,
        friends: updatedFriends,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === selectedPost._id
            ? { ...post, musicians: updatedMusicians, friends: updatedFriends }
            : post
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) {
    return (
      <View style={mapStyles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        {posts.map((post, index) => {
          const latitude = parseFloat(post.city.latitude);
          const longitude = parseFloat(post.city.longitude);

          const isCurrentUserPost = post.userId === userData.userId;

          if (!isNaN(latitude) && !isNaN(longitude)) {
            return (
              <Marker
                key={index}
                coordinate={{ latitude, longitude }}
                pinColor={isCurrentUserPost ? "green" : "red"}
                title={post.city.description}
                onPress={() => handleMarkerPress(post)}
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

      <Modal visible={!!selectedPost} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={mapStyles.modalContainer}>
            <View style={mapStyles.modalContent}>
              <Text style={mapStyles.modalTitle}>
                {selectedPost?.city.description}
              </Text>
              <Text>
                Event Date:{" "}
                {selectedPost?.date
                  ? new Date(selectedPost.date).toLocaleDateString()
                  : "Invalid Date"}
              </Text>
              <Text>
                Beginning Time:{" "}
                {selectedPost?.beginningTime
                  ? new Date(selectedPost.beginningTime).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : "No Time"}
              </Text>
              <Text>
                End Time:{" "}
                {selectedPost?.endTime
                  ? new Date(selectedPost.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "No Time"}
              </Text>

              <Text>Musicians: {selectedPost?.musicians}</Text>
              <Text>Friends: {selectedPost?.friends}</Text>
              <Text>Instruments: {selectedPost?.instruments}</Text>
              <Text>Comment: {selectedPost?.comment}</Text>

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

              <TouchableOpacity
                onPress={updatePost}
                disabled={!isSendButtonEnabled}
                style={[
                  mapStyles.sendButton,
                  { opacity: isSendButtonEnabled ? 1 : 0.5 },
                ]}
              >
                <Text style={mapStyles.sendButtonText}>Send</Text>
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
