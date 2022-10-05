import React, { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";

const AddToChatButton = ({ navigation }) => {

  const onPress = () => {
    navigation.navigate("Add")
    navigation.getParent().setOptions({
      headerTitle: "Add",
      headerRight: () => {}
    })
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
