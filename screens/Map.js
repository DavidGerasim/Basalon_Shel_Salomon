import React from "react";
import { View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { mapStyles } from "./../components/styles"; // נתיב לקובץ העיצוב

const Map = ({ navigation }) => {
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
        <Marker coordinate={{ latitude: 32.109333, longitude: 34.855499 }} />
        <Marker coordinate={{ latitude: 31.768319, longitude: 35.21371 }} />
      </MapView>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={mapStyles.arrowButton}
      >
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

export default Map;
