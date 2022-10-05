import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale } from "../../utility/scalingUtils";
import { convertTime, useInterval } from "../../utility/utils";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../data/colors";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import ProfilePictureStack from "../ProfilePictureStack/ProfilePictureStack";
import ChatUsernames from "../ChatUsernames/ChatUsernames";

const ChatBar = ({ chatHeader }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("OneOnOneChat", {
          id: chatHeader["id"],
          principals: chatHeader["otherUsers"],
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <ProfilePictureStack
            principals={chatHeader["otherUsers"]}
            style={styles.avatar}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.usernameContainer}>
            <ChatUsernames
              principals={chatHeader["otherUsers"]}
              style={styles.username}
            />
          </View>
          {chatHeader["lastMessage"].length > 0 ? (
            <Text style={styles.lastMessage} numberOfLines={2}>
              {chatHeader["lastMessage"][0]["content"]["message"]}
            </Text>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {chatHeader["lastMessage"].length > 0
              ? convertTime(chatHeader["lastMessage"][0]["time"])
              : "New Chat!"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: moderateScale(64.53),
    marginHorizontal: moderateScale(26),
    marginVertical: moderateScale(17.5),
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "20%",
    height: "100%",
  },
  avatar: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 100,
  },
  textContainer: {
    flex: 1,
    marginLeft: moderateScale(9.5),
  },
  usernameContainer: { alignItems: "flex-start" },
  username: {
    color: colors.WHITE,
    fontSize: moderateScale(14),
    fontFamily: "Poppins-Medium",
  },
  lastMessage: {
    color: colors.GRAY,
    fontSize: moderateScale(13),
    lineHeight: moderateScale(20),
    fontFamily: "Poppins-Regular",
    height: moderateScale(42),
    width: moderateScale(170),
  },
  timeContainer: {
    width: moderateScale(60),
  },
  time: {
    color: colors.GRAY,
    fontSize: moderateScale(10),
    fontFamily: "Poppins-Regular",
    position: "absolute",
    bottom: moderateScale(10),
  },
});

export default ChatBar;
