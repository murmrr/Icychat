import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, scale } from "../../utility/scalingUtils";
import {
  convertTime,
  decryptAsymmetric,
  decryptSymmetric,
  useInterval,
} from "../../utility/utils";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../data/colors";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import ProfilePictureStack from "../ProfilePictureStack/ProfilePictureStack";
import ChatUsernames from "../ChatUsernames/ChatUsernames";
import OpenPGP from "react-native-fast-openpgp";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatBar = ({ chatHeader }) => {
  const [decryptedMessage, setDecryptedMessage] = useState(null);

  const navigation = useNavigation();

  useEffect(async () => {
    const myChatKey = chatHeader["key"];
    const privateKey = await AsyncStorage.getItem("@privateKey");
    const chatKey = await decryptAsymmetric(myChatKey, privateKey);

    if (chatHeader["lastMessage"].length > 0) {
      const decryptedMessage = await decryptSymmetric(
        chatHeader["lastMessage"][0]["content"]["message"],
        chatKey
      );
      setDecryptedMessage(decryptedMessage);
    } else {
      setDecryptedMessage(" ");
    }
  }, [chatHeader]);

  return (
    <TouchableOpacity
      onPress={async () => {
        const myChatKey = chatHeader["key"];
        const privateKey = await AsyncStorage.getItem("@privateKey");
        const chatKey = await decryptAsymmetric(myChatKey, privateKey);

        navigation.navigate("OneOnOneChat", {
          id: chatHeader["id"],
          chatKey: chatKey,
          principals: chatHeader["otherUsers"],
        });
      }}
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
          {decryptedMessage ? (
            <Text style={styles.lastMessage} numberOfLines={2}>
              {chatHeader["lastMessage"].length > 0 ? decryptedMessage : ""}
            </Text>
          ) : (
            <View style={styles.lastMessageLoadingContainer}>
              <CustomActivityIndicator />
            </View>
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
  lastMessageLoadingContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
