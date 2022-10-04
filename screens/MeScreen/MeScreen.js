import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import UserAvatar from "react-native-user-avatar";
import colors from "../../data/colors";
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
    <ScrollView
      style={{ backgroundColor: colors.DARK_PRIMARY }}
      contentContainerStyle={styles.container}
    >
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
    backgroundColor: colors.DARK_PRIMARY,
  },
  avatarContainer: {
    width: scale(121),
    aspectRatio: 1,
    marginBottom: scale(30),
  },
  avatar: {
    flex: 1,
    borderRadius: scale(90),
  },
  textContainer: {
    alignSelf: "center",
  },
  username: {
    fontFamily: "Poppins-Medium",
    color: colors.WHITE,
    textAlign: "center",
    fontSize: scale(25),
    marginBottom: scale(15),
  },
  principal: {
    fontFamily: "Poppins-Regular",
    color: colors.WHITE,
    textAlign: "center",
    fontSize: scale(8),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY,
  },
});

export default MeScreen;
