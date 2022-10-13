import { createStackNavigator } from "@react-navigation/stack";
import { useLayoutEffect } from "react";
import colors from "../../data/colors";
import InfoScreen from "../../screens/InfoScreen/InfoScreen";
import MeScreen from "../../screens/MeScreen/MeScreen";
import InfoNavigation from "../InfoNavigation/InfoNavigation";

const Stack = createStackNavigator();

const MeNavigation = ({ navigation, setIsSignedIn }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "Me",
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
      <Stack.Screen name="Me">
        {(props) => <MeScreen setIsSignedIn={setIsSignedIn} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="InfoNavigation" component={InfoNavigation} />
    </Stack.Navigator>
  );
};

export default MeNavigation;
