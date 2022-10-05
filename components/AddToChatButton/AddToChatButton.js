import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";

const AddToChatButton = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Icon name="plus" size={16} color={colors.WHITE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AddToChatButton;
