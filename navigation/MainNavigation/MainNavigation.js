import FindScreen from "../../screens/FindScreen/FindScreen";
import MeScreen from "../../screens/MeScreen/MeScreen";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsNavigation from "../ChatsNavigation/ChatsNavigation";
import colors from "../../data/colors";

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: colors.LIGHT_PRIMARY,
      },
      tabBarStyle: {
        backgroundColor: colors.LIGHT_PRIMARY,
        borderTopWidth: 0,
      },
      headerShadowVisible: false,
    }}>
      <Tab.Screen name="Chats" component={ChatsNavigation} />
      <Tab.Screen name="Find" component={FindScreen} />
      <Tab.Screen name="Me" component={MeScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigation;
