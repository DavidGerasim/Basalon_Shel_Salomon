import React, { useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import {
  UploadingPostInputContainer,
  UploadingTextInputStyled,
  UploadingInputLabel,
} from "./../components/styles";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const LocationInput = ({ address, onLocationChange }) => {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_KEY = "4bFTytZDyahavdUEDNn_Y7_jkBl78wsqrCdR84MWLHU";

  const handleLocationChange = async (value) => {
    onLocationChange(value);

    if (value.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
            value
          )}&apiKey=${API_KEY}`
        );

        const suggestions = response.data.items;
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

  const handleLocationSelect = (item) => {
    const { title, position } = item;
    const result = {
      description: title,
      latitude: position.lat,
      longitude: position.lng,
    };

    console.log("Selected location details:", result);
    onLocationChange(result);
    setShowSuggestions(false);
  };

  return (
    <View>
      <UploadingInputLabel>Address</UploadingInputLabel>
      <UploadingPostInputContainer>
        <Ionicons name="location-outline" size={24} color="#9CA3AF" />
        <UploadingTextInputStyled
          placeholder="Write Your Address"
          value={address?.description || address}
          onChangeText={handleLocationChange}
        />
      </UploadingPostInputContainer>

      {loading && (
        <ActivityIndicator
          size="small"
          color="#8c4e79"
          style={{ marginTop: 10 }}
        />
      )}

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
              <Text style={{ color: "#000" }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default LocationInput;
