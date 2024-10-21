import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationIcon = ({ navigation }) => {
  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "scheduled", title: "You are hosting" },
    { key: "hosted", title: "You are guesting at" },
  ]);

  const [userData, setUserData] = useState({
    userId: "",
  });
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [hostedMeetings, setHostedMeetings] = useState([]);

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

        setUserData({
          userId: data.userId,
        });

        // Fetch meetings for the user
        await fetchUserMeetings(data.userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "An error occurred while fetching user data.");
        navigation.navigate("Login");
      }
    };

    const fetchUserMeetings = async (userId) => {
      try {
        const response = await fetch(
          `http://10.0.0.9:3000/api/meetings/${userId}`
        );
        const meetings = await response.json();

        // בדוק אם הפגישות מוגדרות
        if (meetings.length) {
          setScheduledMeetings(meetings); // זה עבור הפגישות המארחות
        } else {
          setScheduledMeetings([]); // אם אין פגישות קבועות, הגדר מערך ריק
          console.error("No scheduled meetings available.");
        }

        // כאן מתבצעת קריאה לפגישות שבהן המשתמש משתתף (guesting)
        const hostedResponse = await fetch(
          `http://10.0.0.9:3000/api/meetings/guest/${userId}`
        );
        const hostedMeetings = await hostedResponse.json();

        if (hostedMeetings.length) {
          setHostedMeetings(hostedMeetings);
        } else {
          setHostedMeetings([]);
          console.error("No hosted meetings available.");
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchUserData();
  }, [navigation]);

  // Define the scenes for each tab
  const ScheduledMeetingsRoute = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      {scheduledMeetings.length === 0 ? (
        <Text style={{ color: "white", fontSize: 16 }}>Empty List</Text>
      ) : (
        scheduledMeetings.map((meeting, index) => (
          <Text key={index} style={{ color: "white", fontSize: 16 }}>
            {meeting.title} - {meeting.date}
          </Text>
        ))
      )}
    </View>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const HostedMeetingsRoute = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#121212",
        padding: 10,
      }}
    >
      {hostedMeetings.length === 0 ? (
        <Text style={{ color: "white", fontSize: 16 }}>Empty List</Text>
      ) : (
        hostedMeetings.map((meeting, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: 8,
              padding: 15,
              marginVertical: 5,
              width: "90%",
            }}
          >
            {/* הצגת תאריך הפגישה */}
            <Text style={{ color: "white", fontSize: 16 }}>
              Date: {formatDate(meeting.date)}
            </Text>

            <Text style={{ color: "white", fontSize: 16 }}>
              Location: {meeting.city.description.split(",")[0]}
            </Text>

            {/* הצגת שעת התחלה */}
            <Text style={{ color: "white", fontSize: 16 }}>
              Beginning Time: {formatTime(meeting.beginningTime)}
            </Text>

            {/* הצגת שעת סיום */}
            <Text style={{ color: "white", fontSize: 16 }}>
              End Time: {formatTime(meeting.endTime)}
            </Text>

            {/* הצגת מוזיקאים */}
            <Text style={{ color: "white", fontSize: 16 }}>
              Musicians: {meeting.musicians}
            </Text>

            {/* הצגת חברים */}
            <Text style={{ color: "white", fontSize: 16 }}>
              Friends: {meeting.friends}
            </Text>

            {/* הצגת כלים */}
            <Text style={{ color: "white", fontSize: 16 }}>
              Instruments: {meeting.instruments}
            </Text>

            {/* הצגת תגובות */}
            <Text style={{ color: "white", fontSize: 16 }}>
              Comments: {meeting.comment}
            </Text>

            {/* הצגת מספר הטלפון */}
            <Text style={{ color: "white", fontSize: 16 }}>
              Phone Number: {meeting.phoneNumber}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  const renderScene = SceneMap({
    scheduled: ScheduledMeetingsRoute,
    hosted: HostedMeetingsRoute,
  });

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <View style={{ flex: 1, marginTop: 80 }}>
          {/* Back Icon */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", left: 10, top: 35 }}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
          </TouchableOpacity>

          {/* Page Title */}
          <Text
            style={{
              color: "white",
              fontSize: 24,
              textAlign: "center",
              marginTop: 35,
              width: "20%",
              alignSelf: "center",
            }}
          >
            List
          </Text>

          {/* Tab View */}
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "white" }}
                style={{ backgroundColor: "#333" }}
                labelStyle={{ color: "white" }}
              />
            )}
            style={{ marginTop: 30 }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationIcon;
