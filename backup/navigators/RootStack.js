import React, { useState } from "react";
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
  const [notifications, setNotifications] = useState([]);

  const addNotification = (address, date, time) => {
    const newNotification = {
      id: notifications.length + 1, // יצירת מזהה פשוט
      text: `נקבע פגישה ב ${address} בתאריך ${date} בשעה ${time}`, // טקסט ההודעה
    };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

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
        <Stack.Screen name="Map">
          {(props) => <Map {...props} addNotification={addNotification} />} 
        </Stack.Screen>
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="UploadingPost" component={UploadingPost} />
        <Stack.Screen name="PasswordRestorePage_1" component={PasswordRestorePage_1} />
        <Stack.Screen name="PasswordRestorePage_2" component={PasswordRestorePage_2} />
        <Stack.Screen name="ConfirmReject" component={ConfirmReject} />
        <Stack.Screen name="NotificationIcon">
          {(props) => <NotificationIcon {...props} notifications={notifications} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
