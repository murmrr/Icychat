import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";

const AddToChatButton = ({ id, chatKey, navigation }) => {
  const onPress = () => {
    navigation.navigate("Add", {
      id: id,
      chatKey: chatKey,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name="plus" size={18} color={colors.WHITE} />
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
});

export default AddToChatButton;
