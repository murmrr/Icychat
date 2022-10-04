import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import { convertTime, useInterval } from "../../utility/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import colors from "../../data/colors";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const Message = ({ message }) => {
  const [profile, setProfile] = useState(null);
  const [isMe, setIsMe] = useState(false);

  useEffect(async () => {
    try {
      let value = await AsyncStorage.getItem("@identity");
      if (value != null) {
        let principal = Ed25519KeyIdentity.fromParsedJson(
          JSON.parse(value)
        ).getPrincipal();
        if (principal.toString() === message["sender"].toString()) {
          setIsMe(true);
        } else {
          setIsMe(false);
        }
      }
    } catch (error) {}
  }, []);

  useInterval(async () => {
    const response = await (
      await getBackendActor()
    ).getProfile(message["sender"]);
    if (response["ok"]) {
      setProfile(response["ok"]);
    } else if (response["#err"]) {
      setProfile(null);
    }
  }, POLLING_INTERVAL);

  return (
    <View style={styles.root(isMe)}>
      <View style={styles.avatarContainer(isMe)}>
        <View style={styles.nestedContainer}>
          {profile ? (
            <CustomProfilePicture
              principal={profile["userPrincipal"]}
              style={styles.avatar}
            />
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <View style={styles.textsContainer(isMe)}>
          {profile ? (
            <Text style={styles.avatarTitle(isMe)}>
              {isMe ? "Me" : profile["username"]}
            </Text>
          ) : (
            <ActivityIndicator />
          )}
          <Text style={styles.messageTime(isMe)}>
            {convertTime(message["time"])}
          </Text>
        </View>
      </View>
      <View style={styles.messageContainer(isMe)}>
        <Text style={styles.message(isMe)}>
          {message["content"]["message"]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: (isMe) => ({
    paddingLeft: isMe ? 0 : 20,
    paddingRight: isMe ? 20 : 0,
    paddingBottom: 10,
    paddingTop: 20,
    alignContent: "center",
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
    color: isMe ? colors.EXTRA_LIGHT_PRIMARY : colors.DARK_SECONDARY,
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
  message: (isMe) => ({
    color: colors.WHITE,
    fontSize: 15,
    marginBottom: 10,
    textAlign: isMe ? "right" : "left",
  }),
});

export default Message;
