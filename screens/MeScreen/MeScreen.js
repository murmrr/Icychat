import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import UserAvatar from "react-native-user-avatar";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";

const MeScreen = () => {
  const [profile, setProfile] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getMyProfile();
    if (response["ok"]) {
      setProfile(response["ok"]);
    } else if (response["#err"]) {
      setProfile(null);
    }
  }, POLLING_INTERVAL);

  return profile ? (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <UserAvatar name={profile["username"]} style={styles.avatar} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{profile["username"]}</Text>
        <Text style={styles.principal}>
          {profile["userPrincipal"].toText()}
        </Text>
      </View>
    </View>
  ) : (
    <ActivityIndicator />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  avatarContainer: {
    width: scale(60),
    aspectRatio: 1,
  },
  avatar: {
    flex: 1,
    borderRadius: scale(60),
  },
  textContainer: {
    alignSelf: "center",
  },
  username: {
    textAlign: "center",
    fontSize: scale(15),
  },
  principal: {
    textAlign: "center",
    fontSize: scale(12),
  },
});

export default MeScreen;
