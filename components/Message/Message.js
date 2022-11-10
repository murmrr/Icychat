import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  getFromCache,
  isInCache,
  MESSAGE_CACHE,
  PROFILE_CACHE,
} from "../../utility/caches";
import {
  convertTime,
  decryptSymmetric,
  parseProfile,
  stringifyProfile,
} from "../../utility/utils";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const Message = ({ message, chatKey }) => {
  const context = useContext(MainContext);

  const [profile, setProfile] = useState(
    isInCache(PROFILE_CACHE, message["sender"])
      ? parseProfile(getFromCache(PROFILE_CACHE, message["sender"]))
      : null
  );
  const [isMe, setIsMe] = useState(
    Ed25519KeyIdentity.fromJSON(JSON.stringify(context))
      .getPrincipal()
      .toString() === message["sender"].toString()
      ? true
      : false
  );
  const [decryptedMessage, setDecryptedMessage] = useState(
    isInCache(MESSAGE_CACHE, message["content"]["message"])
      ? getFromCache(MESSAGE_CACHE, message["content"]["message"])
      : ""
  );

  useEffect(async () => {
    if (profile == null) {
      const response = await makeIcychatActor(context).getProfile(
        message["sender"]
      );
      setProfile(response["ok"]);
      addToCache(
        PROFILE_CACHE,
        message["sender"],
        stringifyProfile(response["ok"])
      );
    }
  }, []);

  useEffect(async () => {
    if (decryptedMessage == "") {
      const decryptedMessage = await decryptSymmetric(
        message["content"]["message"],
        chatKey
      );
      setDecryptedMessage(decryptedMessage);
      addToCache(
        MESSAGE_CACHE,
        message["content"]["message"],
        decryptedMessage
      );
    }
  }, []);

  return (
    <View style={styles.root(isMe)}>
      <View style={styles.avatarContainer(isMe)}>
        <View style={styles.nestedContainer}>
          <CustomProfilePicture
            principal={message["sender"]}
            style={styles.avatar}
          />
        </View>
        <View style={styles.textsContainer(isMe)}>
          {isMe ? (
            <Text style={styles.avatarTitle(isMe)}>Me</Text>
          ) : (
            <>
              {" "}
              {profile ? (
                <Text style={styles.avatarTitle(isMe)}>
                  {profile["username"]}
                </Text>
              ) : (
                <CustomActivityIndicator />
              )}
            </>
          )}
          <Text style={styles.messageTime(isMe)}>
            {convertTime(message["time"])}
          </Text>
        </View>
      </View>
      <View style={styles.messageContainer(isMe)}>
        {decryptedMessage ? (
          <View style={styles.messageBackground(isMe)}>
            <View style={styles.messageBackgroundArrow(isMe)} />
            <Text style={styles.message(isMe)}>{decryptedMessage}</Text>
          </View>
        ) : (
          <View style={styles.messageLoadingContainer}>
            <CustomActivityIndicator />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: (isMe) => ({
    paddingLeft: isMe ? 0 : 10,
    paddingRight: isMe ? 10 : 0,
    paddingBottom: 10,
    paddingTop: 20,
    alignContent: "center",
    marginLeft: isMe ? 20 : 10,
    marginRight: isMe ? 10 : 20,
  }),
  avatarContainer: (isMe) => ({
    flexDirection: isMe ? "row-reverse" : "row",
    marginLeft: isMe ? "auto" : 0,
  }),
  nestedContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 5,
  },
  textsContainer: (isMe) => ({
    marginLeft: 15,
    flexDirection: isMe ? "row-reverse" : "row",
    alignItems: "center",
    paddingBottom: 13,
    marginTop: -5,
  }),
  avatarTitle: (isMe) => ({
    color: isMe ? colors.HOT_PINK : colors.ORANGE,
    fontSize: 15,
  }),
  messageTime: (isMe) => ({
    color: colors.GRAY,
    marginLeft: isMe ? 0 : 15,
    marginRight: isMe ? 15 : 0,
    fontSize: 11,
  }),
  messageContainer: (isMe) => ({
    width: isMe ? "88%" : "82%",
    marginTop: isMe ? -10 : -7,
    marginLeft: isMe ? 0 : 52,
    paddingRight: isMe ? 8 : 0,
  }),
  messageLoadingContainer: { justifyContent: "flex-end", flexDirection: "row" },
  messageBackground: (isMe) => ({
    alignSelf: isMe ? "flex-end" : "flex-start",
    backgroundColor: isMe ? colors.CHAT_BLUE : colors.CHAT_GRAY,
    borderRadius: 20,
    borderTopStartRadius: isMe ? 20 : 0,
    borderTopEndRadius: isMe ? 0 : 20,
    paddingVertical: "2.5%",
    paddingHorizontal: "3%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }),
  messageBackgroundArrow: (isMe) => ({
    position: "absolute",
    width: 5,
    height: 5,
    top: 0,
    borderBottomRightRadius: isMe ? 10 : 0,
    borderBottomLeftRadius: isMe ? 0 : 10,
    right: isMe ? 0 : undefined,
    left: isMe ? undefined : 0,
    backgroundColor: isMe ? colors.CHAT_BLUE : colors.CHAT_GRAY,
    zIndex: -10,
  }),
  message: (isMe) => ({
    color: colors.WHITE,
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    textAlign: isMe ? "right" : "left",
  }),
});

export default Message;
