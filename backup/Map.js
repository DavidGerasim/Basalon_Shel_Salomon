import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // ייבוא axios
import { mapStyles } from "./../components/styles"; // נתיב לקובץ העיצוב

const Map = ({ navigation }) => {
  // יצירת state לאחסון הפוסטים
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // מצב טעינה

  // שליפת הפוסטים מהשרת
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://10.0.0.14:3000/api/posts");
        console.log("Response data:", response.data); // הצג את הנתונים המתקבלים
        setPosts(response.data); // עדכון ה-state עם הפוסטים
        setLoading(false); // הפסקת מצב הטעינה
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts(); // קריאת הפונקציה
  }, []);

  if (loading) {
    // מציג את האינדיקטור לטעינה אם עדיין בטעינה
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
        {/* מיפוי הפוסטים למיקום על המפה */}
        {posts.map((post, index) => {
          // גישה לקואורדינטות מתוך האובייקט city
          const latitude = parseFloat(post.city.latitude);
          const longitude = parseFloat(post.city.longitude);

          if (!isNaN(latitude) && !isNaN(longitude)) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude,
                  longitude,
                }}
                pinColor="red" // הצגת הסמן בצבע אדום
                title={post.city.description} // שם העיר, יכול להיות תיאור או שם
              />
            );
          }
          return null; // אם הקואורדינטות לא תקינות, לא להחזיר Marker
        })}
      </MapView>

      {/* כפתור חזרה */}
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
