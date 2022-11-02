import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import OneSignal from "react-native-onesignal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import InfoButton from "../../components/InfoButton/InfoButton";
import colors from "../../data/colors";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const insets = useSafeAreaInsets();

  const context = useContext(MainContext);

  OneSignal.addPermissionObserver(async () => {
    const deviceState = await OneSignal.getDeviceState();
    await makeIcychatActor(context).setMyPushToken(deviceState["userId"]);
  });

  useInterval(async () => {
    const deviceState = await OneSignal.getDeviceState();
    if (
      !deviceState["hasNotificationPermission"] ||
      !deviceState["isSubscribed"]
    ) {
      setNotificationsEnabled(false);
    } else {
      setNotificationsEnabled(true);
    }
  }, 100);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => <CustomBackButton navigation={navigation} />,
      headerStyle: {
        backgroundColor: colors.BLUE,
      },
    });

    navigation
      .getParent()
      .getParent()
      .setOptions({
        tabBarStyle: {
          display: "none",
        },
      });

    return () => {
      navigation
        .getParent()
        .getParent()
        .setOptions({
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
        });
    };
  }, []);

  const toggleNotificationsSwitch = async () => {
    if (notificationsEnabled) {
      OneSignal.disablePush(true);
      setNotificationsEnabled((previousState) => !previousState);
    } else {
      const deviceState = await OneSignal.getDeviceState();
      if (!deviceState["hasNotificationPermission"]) {
        OneSignal.promptForPushNotificationsWithUserResponse(true);
        const deviceState2 = await OneSignal.getDeviceState();
        if (deviceState2["hasNotificationPermission"]) {
          setNotificationsEnabled((previousState) => !previousState);
        }
      } else if (!deviceState["isSubscribed"]) {
        OneSignal.disablePush(false);
        setNotificationsEnabled((previousState) => !previousState);
      }
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.DARK_PRIMARY }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.notificationSwitchContainer}>
        <Switch
          trackColor={{ true: colors.ORANGE }}
          ios_backgroundColor={colors.LIGHT_GRAY}
          onValueChange={toggleNotificationsSwitch}
          value={notificationsEnabled}
          style={styles.notificationSwitch}
        />
        <Text style={styles.notificationSwitchText}>Allow Notifications</Text>
      </View>
      <InfoButton name={"About"} onPress={() => navigation.navigate("About")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: verticalScale(15),
    flex: 1,
    backgroundColor: colors.DARK_PRIMARY,
    alignItems: "center",
  },
  notificationSwitchContainer: {
    width: scale(310),
    height: scale(60),
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.BLUE,
    marginVertical: verticalScale(8),
  },
  notificationSwitchText: {
    marginRight: scale(20),
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Poppins-Medium",
  },
  notificationSwitch: {
    marginLeft: scale(20),
  },
});

export default SettingsScreen;
