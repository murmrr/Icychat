import FindScreen from "../../screens/FindScreen/FindScreen";
import MeScreen from "../../screens/MeScreen/MeScreen";
import React, { createContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsNavigation from "../ChatsNavigation/ChatsNavigation";
import colors from "../../data/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarIcon from "../../components/TabBarIcon/TabBarIcon";

export const MainContext = createContext("");

const Tab = createBottomTabNavigator();

const MainNavigation = ({ identity, setIsSignedIn }) => {
  const insets = useSafeAreaInsets();

  return (
    <MainContext.Provider value={identity}>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: colors.BLUE,
          },
          headerTitleStyle: {
            color: "#FFFFFF",
            fontSize: 20,
            fontFamily: "Poppins-Medium",
          },
          tabBarStyle: {
            backgroundColor: colors.BLUE,
            position: "absolute",
            left: 24,
            right: 24,
            bottom: insets.bottom == 0 ? 24 : insets.bottom,
            elevation: 0,
            borderRadius: 35,
            height: 60,
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
          headerShadowVisible: false,
        }}
      >
        <Tab.Screen
          name="Chats"
          component={ChatsNavigation}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                image={require("../../assets/chats-icon.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Find"
          component={FindScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                image={require("../../assets/find-icon.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Me"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                image={require("../../assets/me-icon.png")}
              />
            ),
          }}
        >
          {(props) => <MeScreen setIsSignedIn={setIsSignedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </MainContext.Provider>
  );
};

export default MainNavigation;
