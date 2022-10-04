import React from "react";
import { Image, StyleSheet, View } from "react-native";
import UserAvatar from "react-native-user-avatar";

const CustomProfilePicture = ({ principal, style }) => {
  return (
    <View style={style}>
      <Image
        source={require("../../assets/0.png")}
        style={[style, styles.image]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
});

export default CustomProfilePicture;
