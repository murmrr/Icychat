import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../../screens/SignUpScreen/SignUpScreen";

const Stack = createStackNavigator();

const AuthNavigation = ({ setIsSignedIn }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Sign Up">
        {(props) => <SignUpScreen setIsSignedIn={setIsSignedIn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigation;
