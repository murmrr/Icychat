import React from "react";
import { StyleSheet, View } from "react-native";
import ChatBarList from "../../components/ChatBarList/ChatBarList";
import colors from "../../data/colors";

const ChatsScreen = () => {
  return (
    <View style={styles.container}>
      <ChatBarList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DARK_PRIMARY,
  },
});

export default ChatsScreen;
