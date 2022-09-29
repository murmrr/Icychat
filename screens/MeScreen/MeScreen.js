import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <UserAvatar name={profile["username"]} style={styles.avatar} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{profile["username"]}</Text>
        <Text style={styles.principal}>
          {profile["userPrincipal"].toText()}
        </Text>
      </View>
    </ScrollView>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default MeScreen;
