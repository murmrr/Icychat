import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { createContext, useEffect } from "react";
import OneSignal from "react-native-onesignal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarIcon from "../../components/TabBarIcon/TabBarIcon";
import colors from "../../data/colors";
import { makeIcychatActor } from "../../lib/actor";
import FindScreen from "../../screens/FindScreen/FindScreen";
import ChatsNavigation from "../ChatsNavigation/ChatsNavigation";
import MeNavigation from "../MeNavigation/MeNavigation";
import DeviceInfo from "react-native-device-info";

export const MainContext = createContext("");

const Tab = createBottomTabNavigator();

const MainNavigation = ({ identity, setIsSignedIn }) => {
  const insets = useSafeAreaInsets();

  useEffect(async () => {
    OneSignal.setAppId("19d49feb-ac2c-494c-9f7c-d8392c73d838");
    const deviceState = await OneSignal.getDeviceState();
    if (deviceState["notificationPermissionStatus"]) {
      await makeIcychatActor(identity).addPushToken(
        await DeviceInfo.getUniqueId(),
        deviceState["userId"]
      );
    }
  }, []);

  return (
    <MainContext.Provider value={identity}>
      <Tab.Navigator
        screenOptions={{
          lazy: false,
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
          name="ChatsNavigation"
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
          name="MeNavigation"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                image={require("../../assets/me-icon.png")}
              />
            ),
          }}
        >
          {(props) => <MeNavigation setIsSignedIn={setIsSignedIn} {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </MainContext.Provider>
  );
};

export default MainNavigation;
