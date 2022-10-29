import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";
import Icon from "react-native-vector-icons/Feather";

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <Icon
        name="wifi-off"
        size={scale(120)}
        color={colors.WHITE}
        style={styles.logo}
      />
      <Text style={styles.text}>Icychat Needs an Internet Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: verticalScale(80),
  },
  text: {
    fontFamily: "Poppins-Medium",
    color: colors.WHITE,
    fontSize: scale(30),
    textAlign: "center",
  },
});

export default NoInternetScreen;
