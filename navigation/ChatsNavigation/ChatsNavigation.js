import { createStackNavigator } from "@react-navigation/stack";
import { useLayoutEffect, useState } from "react";
import colors from "../../data/colors";
import ChatsScreen from "../../screens/ChatsScreen/ChatsScreen";
import ConversationScreen from "../../screens/ConversationScreen/ConversationScreen";
import FindScreen from "../../screens/FindScreen/FindScreen";

const Stack = createStackNavigator();

const ChatsNavigation = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "Chats",
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
      <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
      <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
      <Stack.Screen name="Add">
        {(props) => <FindScreen forAdd={true} {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default ChatsNavigation;
