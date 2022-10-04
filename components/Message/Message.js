import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import UserAvatar from "react-native-user-avatar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";

const Message = ({ message }) => {
  const [profile, setProfile] = useState(null);
  const [isMe, setIsMe] = useState(false);

  useEffect(async () => {
    try {
      let value = await AsyncStorage.getItem("@identity");
      if (value != null) {
        let principal = Ed25519KeyIdentity.fromParsedJson(JSON.parse(value)).getPrincipal();
        if (principal.toString() === message["sender"].toString()) {
          setIsMe(true);
        } else {
          setIsMe(false);
        }
      }
    } catch (error) {}
  }, [])

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
    <View style={styles.container(isMe)}>
      <Text style={styles.text(isMe)}>{message["content"]["message"]}</Text>
      {profile ? (
        <UserAvatar name={profile["username"]} style={styles.avatar(isMe)} />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: (isMe) => ({
    width: "100%",
    height: scale(60),
    flexDirection: isMe ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    //borderWidth: 1,
  }),
  text: (isMe) => ({
    marginHorizontal: scale(20),
  }),
  avatar: (isMe) => ({
    height: "90%",
    aspectRatio: 1,
    borderRadius: scale(80),
    marginHorizontal: scale(20),
  }),
});

export default Message;
