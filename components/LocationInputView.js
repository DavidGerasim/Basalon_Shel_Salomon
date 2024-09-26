import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SignupInputContainer, SignupTextInputStyled, SignupInputLabel } from "./../components/styles";

const GOOGLE_PLACES_API_KEY = "AIzaSyB8wLexQ_Hgu8CHvbn-7kYZjyYbFlmcvnc";

const LocationInput = ({ address, onLocationChange }) => {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLocationChange = async (value) => {
    onLocationChange(value);

    // Fetch location suggestions from Google Places API
    if (value.length > 2) {
      try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=${GOOGLE_PLACES_API_KEY}&limit=5`
          );
        console.log("Location suggestions: ", response.data);
        setLocationSuggestions(response.data.predictions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions: ", error);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (address) => {
    onLocationChange(address);
    setShowSuggestions(false);
  };

  return (
    <View>
      <SignupInputLabel>Address</SignupInputLabel>
      <SignupInputContainer>
        <Ionicons name="location-outline" size={24} color="#9CA3AF" />
        <SignupTextInputStyled
          placeholder="Write Your Address"
          value={address}
          onChangeText={handleLocationChange}
        />
      </SignupInputContainer>

      {showSuggestions && (
        <ScrollView
          style={{
            maxHeight: 150, // Limit the height of the suggestion box
            backgroundColor: "#1f1f1f",
            marginTop: 10,
            borderRadius: 5,
          }}
        >
          {locationSuggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              onPress={() => handleLocationSelect(item.description)}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#8c4e79",
              }}
            >
              <Text style={{ color: "#ffffff" }}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default LocationInput;
