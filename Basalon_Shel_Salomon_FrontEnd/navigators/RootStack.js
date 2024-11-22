import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./../screens/Login";
import Signup from "./../screens/Signup";
import Welcome from "./../screens/Welcome";
import Map from "./../screens/Map";
import EditGig from "./../screens/EditGig";
import Settings from "./../screens/Settings";
import UploadingPost from "./../screens/UploadingPost";
import PasswordRestorePage_1 from "./../screens/PasswordRestorePage_1";
import PasswordRestorePage_2 from "./../screens/PasswordRestorePage_2";
import NotificationIcon from "./../screens/NotificationIcon";
import EnterVerificationCode from "./../screens/EnterVerificationCode";

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
          headerBackVisible: false,
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="EditGig" component={EditGig} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="UploadingPost" component={UploadingPost} />
        <Stack.Screen
          name="PasswordRestorePage_1"
          component={PasswordRestorePage_1}
        />
        <Stack.Screen
          name="EnterVerificationCode"
          component={EnterVerificationCode}
        />
        <Stack.Screen
          name="PasswordRestorePage_2"
          component={PasswordRestorePage_2}
        />
        <Stack.Screen name="NotificationIcon" component={NotificationIcon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
