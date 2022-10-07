import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../../data/colors";
import ProfilePictureStack from "../ProfilePictureStack/ProfilePictureStack";

const CustomHeader = ({ principals }) => {
  return <ProfilePictureStack principals={principals} style={styles.avatar} />;
};

const styles = StyleSheet.create({
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
