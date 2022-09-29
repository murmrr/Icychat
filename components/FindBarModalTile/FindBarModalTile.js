import React, { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import UserAvatar from "react-native-user-avatar";

const FindBarModalTile = ({ principal, setModalVisible }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useInterval(async () => {
    const response = await (await getBackendActor()).getProfile(principal);
    if (response["ok"]) {
      setProfile(response["ok"]);
    } else if (response["#err"]) {
      setProfile(null);
    }
  }, POLLING_INTERVAL);

  const createChat = async () => {
    setLoading(true);
    const response = await (await getBackendActor()).createChat(principal);
    setLoading(false);
    setModalVisible(false);
  }

  return (
    <TouchableOpacity style={styles.touchableView} onPress={() => setModalVisible(false)}>
    <View style={styles.container}>
      {profile ? (
        <View style={styles.profileContainer}>
          <UserAvatar name={profile["username"]} style={styles.avatar} />
          <Text style={styles.username}>{profile["username"]}</Text>
          {
            loading ? <ActivityIndicator /> : <Button title="Create Chat!" onPress={createChat}/>
          }
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "gray",
    width: scale(200),
    height: scale(200),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    height: scale(80),
    aspectRatio: 1,
    borderRadius: scale(80),
  },
  username: {
    fontSize: scale(15),
  }
})

export default FindBarModalTile;
