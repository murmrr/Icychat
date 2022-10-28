import { createStackNavigator } from "@react-navigation/stack";
import { useLayoutEffect } from "react";
import colors from "../../data/colors";
import AboutScreen from "../../screens/AboutScreen/AboutScreen";
import NotificationsScreen from "../../screens/NotificationsScreen/NotificationsScreen";
import SettingsScreen from "../../screens/SettingsScreen/SettingsScreen";

const Stack = createStackNavigator();

const SettingsNavigation = ({ navigation, setIsSignedIn }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.BLUE,
        },
        headerTitleStyle: {
          color: "#FFFFFF",
          fontSize: 20,
          fontFamily: "Poppins-Medium",
        },
        tabBarStyle: {
          borderTopWidth: 0,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigation;
