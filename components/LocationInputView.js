import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SignupInputContainer, SignupTextInputStyled, SignupInputLabel } from "./../components/styles";

const LocationInput = ({ address, onLocationChange }) => {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle location input change and fetch suggestions
  const handleLocationChange = async (value) => {
    onLocationChange(value); // Pass the entered value back to the parent component

    // Fetch location suggestions from OpenStreetMap (Nominatim API)
    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5`
        );

        const suggestions = response.data;
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

  // Handle location selection from suggestions
  const handleLocationSelect = (item) => {
    const { display_name, lat, lon } = item;
    const result = {
      description: display_name,
      latitude: lat,
      longitude: lon,
    };

    console.log("Selected location details:", result);
    onLocationChange(result); // Update the parent component with the full location data
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
          {locationSuggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleLocationSelect(item)}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Text style={{ color: "#000" }}>{item.display_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default LocationInput;
