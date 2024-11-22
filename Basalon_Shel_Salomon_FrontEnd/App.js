import React, { useEffect } from "react";
import RootStack from "./navigators/RootStack";
import { I18nManager, Alert } from "react-native";

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
