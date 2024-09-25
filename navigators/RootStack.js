import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./../screens/Login";
import Signup from "./../screens/Signup";
import Welcome from "./../screens/Welcome";
import Map from "./../screens/Map";
import Settings from "./../screens/Settings";
import UploadingPost from "./../screens/UploadingPost";
import PasswordRestorePage_1 from "./../screens/PasswordRestorePage_1";
import PasswordRestorePage_2 from "./../screens/PasswordRestorePage_2";
import ConfirmReject from "./../screens/ConfirmReject";
import NotificationIcon from "./../screens/NotificationIcon";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: "#ffffff",
          headerTransparent: true,
          headerTitle: "",
          headerBackVisible: false, // ביטול חץ החזרה
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="UploadingPost" component={UploadingPost} />
        <Stack.Screen name="PasswordRestorePage_1" component={PasswordRestorePage_1} />
        <Stack.Screen name="PasswordRestorePage_2" component={PasswordRestorePage_2} />
        <Stack.Screen name="ConfirmReject" component={ConfirmReject} />
        <Stack.Screen name="NotificationIcon" component={NotificationIcon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
