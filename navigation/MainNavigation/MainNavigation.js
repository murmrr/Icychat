import ChatsScreen from "../../screens/ChatsScreen/ChatsScreen";
import FindScreen from "../../screens/FindScreen/FindScreen";
import MeScreen from "../../screens/MeScreen/MeScreen";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsNavigation from "../ChatsNavigation/ChatsNavigation";

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={ChatsNavigation} />
      <Tab.Screen name="Find" component={FindScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigation;
