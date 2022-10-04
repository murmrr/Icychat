import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale } from "../../utility/scalingUtils";
import UserAvatar from "react-native-user-avatar";
import { convertTime, useInterval } from "../../utility/utils";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../data/colors";
import Identicon from "@polkadot/reactnative-identicon";

const ChatBar = ({ chatHeader }) => {
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  useInterval(async () => {
    const response = await (
      await getBackendActor()
    ).getProfile(chatHeader["otherUsers"][0]);
    if (response["ok"]) {
      setOtherUserProfile(response["ok"]);
    } else if (response["#err"]) {
      setOtherUserProfile(null);
    }
  }, POLLING_INTERVAL);

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("OneOnOneChat", {
          id: chatHeader["id"],
          principal: chatHeader["otherUsers"][0],
        })
      }
    >
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {otherUserProfile ? (
            <UserAvatar
              name={otherUserProfile["username"]}
              style={styles.avatar}
            />
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <View style={styles.textContainer}>
          {otherUserProfile ? (
            <Text style={styles.username}>{otherUserProfile["username"]}</Text>
          ) : (
            <ActivityIndicator />
          )}
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
