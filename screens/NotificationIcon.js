import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

const NotificationIcon = ({ navigation }) => {
  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "scheduled", title: "you are hosting" },
    { key: "hosted", title: "You are guesting at" },
  ]);

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
      <Text style={{ color: "white", fontSize: 16 }}>אין פגישות שקבעתי</Text>
    </View>
  );

  const HostedMeetingsRoute = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>אין פגישות שנקבעו</Text>
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
                labelStyle={{ color: "white" }} // Added for visibility
              />
            )}
            style={{ marginTop: 30 }} // Add margin to tab view
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default NotificationIcon;
