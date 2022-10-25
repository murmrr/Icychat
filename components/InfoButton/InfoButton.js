import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";

const InfoButton = ({ name, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{name}</Text>
      <Icon
        name="caret-right"
        size={scale(25)}
        color={colors.WHITE}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(310),
    height: scale(60),
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.BLUE,
    marginVertical: verticalScale(8),
  },
  text: {
    marginLeft: scale(20),
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Poppins-Medium",
  },
  icon: {
    marginRight: scale(20),
  },
});

export default InfoButton;
