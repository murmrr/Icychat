import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import UserAvatar from "react-native-user-avatar";

const Message = ({ message }) => {
  const [profile, setProfile] = useState(null);

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
    <View style={styles.container}>
      <Text style={styles.text}>{message["content"]["message"]}</Text>
      {profile ? (
        <UserAvatar
          name={profile["username"]}
          size={scale(80)}
          style={styles.avatar}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scale(60),
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  text: {},
  avatar: {
    height: "90%",
    aspectRatio: 1,
    borderRadius: scale(80),
  },
});

export default Message;
