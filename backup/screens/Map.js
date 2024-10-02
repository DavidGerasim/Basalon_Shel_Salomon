import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { mapStyles } from "./../components/styles";
import io from "socket.io-client";

const Map = ({ navigation, addNotification }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [number1, setNumber1] = useState(""); // State for first number input
  const [number2, setNumber2] = useState(""); // State for second number input

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://10.0.0.14:3000/api/posts");
        console.log("Response data:", response.data);

        // Check for posts that have already started and remove them
        const currentTime = new Date();
        const updatedPosts = response.data.filter((post) => {
          const postEndTime = new Date(post.endTime); // Get the end time of the post
          if (postEndTime < currentTime) {
            // Delete the post from the server
            deletePost(post._id);
            return false; // Do not include this post
          }
          return true; // Include this post
        });

        setPosts(updatedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    // Initial fetch of posts
    fetchPosts();

    // Setting up WebSocket connection with Socket.IO
    const socket = io("http://10.0.0.14:3000"); // Adjust the URL to match your server

    // Listen for "postUpdated" events
    socket.on("postUpdated", (change) => {
      console.log("Post updated:", change);

      // Depending on the change type (insert, update, delete), update the posts state accordingly
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

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://10.0.0.14:3000/api/posts/${postId}`);
      console.log(`Post with ID ${postId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleMarkerPress = (post) => {
    setSelectedPost(post);
    console.log("Selected post:", post); // לוג הפוסט שנבחר
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setNumber1(""); // Clear input on close
    setNumber2(""); // Clear input on close
  };

  const handleNumberInputChange1 = (text) => {
    // Allow only numeric input
    if (/^\d*$/.test(text)) {
      setNumber1(text);
    }
  };

  const handleNumberInputChange2 = (text) => {
    // Allow only numeric input
    if (/^\d*$/.test(text)) {
      setNumber2(text);
    }
  };

  const isSendButtonEnabled = number1 !== "" && number2 !== ""; // Check if both inputs have values

  const updatePost = async () => {
    if (!selectedPost) {
      console.error("No post selected"); // לוג אם אין פוסט נבחר
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

    console.log("Updating post with ID:", selectedPost.id); // לוג של ה-ID
    console.log(
      "Musicians to update:",
      updatedMusicians,
      "Friends to update:",
      updatedFriends
    );

    try {
      const response = await axios.put(
        `http://10.0.0.14:3000/api/posts/${selectedPost._id}`,
        {
          musicians: updatedMusicians,
          friends: updatedFriends,
        }
      );

      console.log("Response from server:", response.data); // לוג תגובה מהשרת

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === selectedPost._id
            ? { ...post, musicians: updatedMusicians, friends: updatedFriends }
            : post
        )
      );

      console.log(
        "Post updated successfully:",
        updatedMusicians,
        updatedFriends
      );

      // Create a notification
      addNotification(
        `Updated post for ${selectedPost.city.description}: ${number1} musicians and ${number2} friends`
      );

      handleCloseModal(); // סגור את המודל אחרי הלחיצה על "שלח"
    } catch (error) {
      console.error(
        "Error updating post:",
        error.response?.data || error.message
      ); // הוסף לוג של השגיאה
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
        {posts
          .filter((post) => {
            const postEndTime = new Date(post.endTime); // Get the end time of the post
            return post.musicians > 0 && postEndTime >= new Date(); // Filter posts based on musicians and end time
          }) // סנן את הפוסטים כך שרק פוסטים עם musicians > 0 יוצגו וגם תאריך הסיום שלהם לא עבר
          .map((post, index) => {
            const latitude = parseFloat(post.city.latitude);
            const longitude = parseFloat(post.city.longitude);

            if (!isNaN(latitude) && !isNaN(longitude)) {
              return (
                <Marker
                  key={index}
                  coordinate={{ latitude, longitude }}
                  pinColor="red"
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
              <TouchableOpacity
                onPress={handleCloseModal}
                style={mapStyles.closeButton}
              >
                <Text style={mapStyles.closeButtonText}>×</Text>
              </TouchableOpacity>
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
                {new Date(selectedPost?.beginningTime).toLocaleString()}
              </Text>
              <Text>
                End Time: {new Date(selectedPost?.endTime).toLocaleString()}
              </Text>
              <Text>Musicians: {selectedPost?.musicians}</Text>
              <Text>Friends: {selectedPost?.friends}</Text>

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
                style={[
                  mapStyles.sendButton,
                  { backgroundColor: isSendButtonEnabled ? "green" : "gray" },
                ]}
                disabled={!isSendButtonEnabled}
                onPress={updatePost}
              >
                <Text style={mapStyles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Map;
