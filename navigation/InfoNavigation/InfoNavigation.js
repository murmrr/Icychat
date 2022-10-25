import { createStackNavigator } from "@react-navigation/stack";
import { useLayoutEffect } from "react";
import colors from "../../data/colors";
import AboutScreen from "../../screens/AboutScreen/AboutScreen";
import InfoScreen from "../../screens/InfoScreen/InfoScreen";
import SettingsScreen from "../../screens/SettingsScreen/SettingsScreen";

const Stack = createStackNavigator();

const InfoNavigation = ({ navigation, setIsSignedIn }) => {
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
      <Stack.Screen name="Info" component={InfoScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default InfoNavigation;
