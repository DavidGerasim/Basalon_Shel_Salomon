import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SignupInputContainer, SignupTextInputStyled, SignupInputLabel } from "./../components/styles";

// Your Google API Key
const GOOGLE_PLACES_API_KEY = "AIzaSyB8wLexQ_Hgu8CHvbn-7kYZjyYbFlmcvnc";

const LocationInput = ({ address, onLocationChange }) => {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle location input change and fetch suggestions
  const handleLocationChange = async (value) => {
    onLocationChange(value); // Pass the entered value back to the parent component

    // Fetch location suggestions from Google Places API
    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${GOOGLE_PLACES_API_KEY}&limit=5`
        );

        const suggestions = response.data.predictions;
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Fetch detailed place information (lat, lng) using place_id
  const fetchLocationDetails = async (placeId) => {
    try {
      const detailsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const locationDetails = detailsResponse.data.result.geometry.location;
      return locationDetails;
    } catch (error) {
      console.error("Error fetching location details:", error);
      return null;
    }
  };

  // Handle location selection from suggestions
  const handleLocationSelect = async (item) => {
    const { description, place_id } = item;
    const locationDetails = await fetchLocationDetails(place_id);
    if (locationDetails) {
      const result = {
        description: description,
        latitude: locationDetails.lat,
        longitude: locationDetails.lng,
      };

      console.log("Selected location details:", result);
      onLocationChange(result); // Update the parent component with the full location data
    }
    setShowSuggestions(false);
  };

  return (
    <View>
      <SignupInputLabel>Address</SignupInputLabel>
      <SignupInputContainer>
        <Ionicons name="location-outline" size={24} color="#9CA3AF" />
        <SignupTextInputStyled
          placeholder="Write Your Address"
          value={address?.description || address} // Show description if location is selected
          onChangeText={handleLocationChange}
        />
      </SignupInputContainer>

      {loading && <ActivityIndicator size="small" color="#8c4e79" style={{ marginTop: 10 }} />}

      {showSuggestions && (
        <ScrollView
          style={{
            maxHeight: 150,
            backgroundColor: "#fff",
            marginTop: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
        >
          {locationSuggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              onPress={() => handleLocationSelect(item)}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Text style={{ color: "#000" }}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default LocationInput;
