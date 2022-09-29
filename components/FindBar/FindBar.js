import React, { useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import UserAvatar from "react-native-user-avatar";
import FindBarModalTile from "../FindBarModalTile/FindBarModalTile";

const FindBar = ({ principal }) => {
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useInterval(async () => {
    const response = await (await getBackendActor()).getProfile(principal);
    if (response["ok"]) {
      setProfile(response["ok"]);
    } else if (response["#err"]) {
      setProfile(null);
    }
  }, POLLING_INTERVAL);

  return (
    <>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalTileContainer}>
          <FindBarModalTile principal={principal} setModalVisible={setModalVisible} />
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            {profile ? (
              <UserAvatar name={profile["username"]} style={styles.avatar} />
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <View style={styles.textContainer}>
            {profile ? (
              <Text style={styles.username}>{profile["username"]}</Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  modalTileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
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
});

export default FindBar;
