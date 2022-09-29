import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { scale } from "../../utility/scalingUtils";
import UserAvatar from "react-native-user-avatar";
import { useInterval } from "../../utility/utils";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
        navigation.navigate("OneOnOneChat", { id: chatHeader["id"], principal: chatHeader["otherUsers"][0] })
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
          <Text style={styles.principal}>
            {chatHeader["otherUsers"][0].toText()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: scale(80),
  },
  avatarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    height: "90%",
    aspectRatio: 1,
    borderRadius: scale(80),
  },
  textContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: scale(10),
  },
  principal: {
    fontSize: scale(6),
  },
});

export default ChatBar;
