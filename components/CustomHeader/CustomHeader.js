import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import ProfilePictureStack from "../ProfilePictureStack/ProfilePictureStack";
import Icon from "react-native-vector-icons/FontAwesome";

const CustomHeader = ({ principals }) => {
  return (
    <View style={styles.container}>
      <Icon name="lock" size={25} color={colors.WHITE} style={styles.icon}/>
    <ProfilePictureStack principals={principals} style={styles.avatar} />
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 25,
    marginBottom: 9,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerUsername: {
    fontSize: 24,
    fontFamily: "Poppins-Medium",
    color: colors.WHITE,
  },
});

export default CustomHeader;
