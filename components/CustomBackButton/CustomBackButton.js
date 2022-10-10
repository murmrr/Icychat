import React from "react";
import { Button, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";

const CustomBackButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
      style={styles.container}
    >
      <Icon name="chevron-left" size={14} color={colors.WHITE} />
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 5,
    marginBottom: 2,
    fontSize: 16,
    color: colors.WHITE,
    fontFamily: "Poppins-Regular",
  },
});

export default CustomBackButton;
