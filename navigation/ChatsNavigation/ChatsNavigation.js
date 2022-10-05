import { createStackNavigator } from "@react-navigation/stack";
import ChatsScreen from "../../screens/ChatsScreen/ChatsScreen";
import FindScreen from "../../screens/FindScreen/FindScreen";
import OneOnOneChatScreen from "../../screens/OneOnOneChatScreen/OneOnOneChatScreen";

const Stack = createStackNavigator();

const ChatsNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
      <Stack.Screen name="OneOnOneChat" component={OneOnOneChatScreen} />
      <Stack.Screen name="Add">
        {(props) => <FindScreen forAdd={true} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default ChatsNavigation;
