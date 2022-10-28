import React, { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import InfoButton from "../../components/InfoButton/InfoButton";
import colors from "../../data/colors";
import { verticalScale } from "../../utility/scalingUtils";

const SettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

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

  return (
    <ScrollView
      style={{ backgroundColor: colors.DARK_PRIMARY }}
      contentContainerStyle={styles.container}
    >
      <InfoButton name={"Notifications"} onPress={() => navigation.navigate("Notifications")} />
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
});

export default SettingsScreen;
