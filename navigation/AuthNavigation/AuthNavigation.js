import { createStackNavigator } from "@react-navigation/stack";
import colors from "../../data/colors";
import SignUpScreen from "../../screens/SignUpScreen/SignUpScreen";

const Stack = createStackNavigator();

const AuthNavigation = ({ setIsSignedIn }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Sign Up">
        {(props) => <SignUpScreen setIsSignedIn={setIsSignedIn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigation;
