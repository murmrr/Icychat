import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import {
  convertTime,
  decryptSymmetric,
  parseProfile,
  useInterval,
} from "../../utility/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import colors from "../../data/colors";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import OpenPGP from "react-native-fast-openpgp";
import {
  addToCache,
  getFromCache,
  MESSAGE_CACHE,
  PROFILE_CACHE,
} from "../../utility/caches";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";

const Message = ({ message, chatKey }) => {
  const [profile, setProfile] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState("");

  const context = useContext(MainContext);

  useEffect(async () => {
    let principal = Ed25519KeyIdentity.fromJSON(
      JSON.stringify(context)
    ).getPrincipal();
    if (principal.toString() === message["sender"].toString()) {
      setIsMe(true);
      setProfile(true);
    } else {
      setIsMe(false);
      let temp = getFromCache(PROFILE_CACHE, message["sender"]);
      if (temp) {
        setProfile(parseProfile(temp));
      } else {
        const response = await makeBackendActor(context).getProfile(
          message["sender"]
        );
        setProfile(response["ok"]);
        addToCache(PROFILE_CACHE, message["sender"], stringify(response["ok"]));
      }
    }
  }, []);

  useEffect(async () => {
    let temp = getFromCache(MESSAGE_CACHE, message["content"]["message"]);
    if (temp) {
      setDecryptedMessage(temp);
    } else {
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
          {profile ? (
            <Text style={styles.avatarTitle(isMe)}>
              {isMe ? "Me" : profile["username"]}
            </Text>
          ) : (
            <CustomActivityIndicator />
          )}
          <Text style={styles.messageTime(isMe)}>
            {convertTime(message["time"])}
          </Text>
        </View>
      </View>
      <View style={styles.messageContainer(isMe)}>
        {decryptedMessage ? (
          <Text style={styles.message(isMe)}>{decryptedMessage}</Text>
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
  message: (isMe) => ({
    color: colors.WHITE,
    fontSize: 15,
    marginBottom: 10,
    textAlign: isMe ? "right" : "left",
  }),
});

export default Message;
