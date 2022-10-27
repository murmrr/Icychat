import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";
import ProfilePictureStack from "../ProfilePictureStack/ProfilePictureStack";

const CustomHeader = ({ principals, setModalVisible }) => {
  return (
    <View style={styles.container}>
      <Icon name="lock" size={25} color={colors.WHITE} style={styles.icon} />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <ProfilePictureStack principals={principals} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  );
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
