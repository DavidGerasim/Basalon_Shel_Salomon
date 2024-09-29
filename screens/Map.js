import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator, Modal, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { mapStyles } from "./../components/styles";

const Map = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://10.0.0.14:3000/api/posts");
        console.log("Response data:", response.data);
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleMarkerPress = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
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
        <View style={mapStyles.modalContainer}>
          <View style={mapStyles.modalContent}>
            <Text style={mapStyles.modalTitle}>{selectedPost?.city.description}</Text>
            <Text>Beginning Time: {new Date(selectedPost?.beginningTime).toLocaleString()}</Text>
            <Text>End Time: {new Date(selectedPost?.endTime).toLocaleString()}</Text>
            <Text>Musicians: {selectedPost?.musicians}</Text>
            <Text>Friends: {selectedPost?.friends}</Text>
            <Text>Instruments: {selectedPost?.instruments}</Text>
            <Text>Comment: {selectedPost?.comment}</Text>
            <TouchableOpacity onPress={handleCloseModal} style={mapStyles.closeButton}>
              <Text style={mapStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Map;
