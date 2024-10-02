import React, { useEffect } from "react";
import RootStack from "./navigators/RootStack";
import { I18nManager } from "react-native";
import { Alert } from "react-native";

export default function App() {
  useEffect(() => {
    const setDirection = async () => {
      try {
        if (I18nManager.isRTL) {
          await I18nManager.forceRTL(false);
          await I18nManager.allowRTL(false);
          Alert.alert(
            "Restart Needed",
            "Please restart the app for changes to take effect."
          );
        }
      } catch (error) {
        console.error("Error setting RTL:", error);
      }
    };
    setDirection();
  }, []);

  return <RootStack />;
}

// import React from "react";
// import RootStack from "./navigators/RootStack";
// import { I18nManager } from "react-native";
// I18nManager.forceRTL(false); // השבתת RTL
// I18nManager.allowRTL(false); // מניעת הפעלת RTL באפליקציה

// export default function App() {
//   return <RootStack />;
// }

// import React from "react";
// import Login from "./screens/Login";
// import Signup from "./screens/Signup";
// import Welcome from "./screens/Welcome";
// import Map from "./screens/Map";
// import Settings from "./screens/Settings";
// import UploadingPost from "./screens/UploadingPost";
// import PasswordRestorePage_1 from "./screens/PasswordRestorePage_1";
// import PasswordRestorePage_2 from "./screens/PasswordRestorePage_2";
// import ConfirmReject from "./screens/ConfirmReject";
// import NotificationIcon from "./screens/NotificationIcon";

// export default function App() {
//   return <PasswordRestorePage_2 />;
// }
