import React, { useState } from "react";
import {
  Dimensions,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PGP_OPTIONS, POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { encryptAsymmetric, generateSymmetricKey, getMyPublicKey, useInterval } from "../../utility/utils";
import colors from "../../data/colors";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import OpenPGP from "react-native-fast-openpgp";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FindBarModalTile = ({
  id,
  chatKey,
  principal,
  forAdd,
  setModalVisible,
}) => {
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

    const otherUserPublicKey = (
      await (await getBackendActor()).getPublicKey(principal)
    )["ok"];
    if (forAdd) {
      const otherUserChatKey = await encryptAsymmetric(chatKey, otherUserPublicKey);

      const response = await (
        await getBackendActor()
      ).addToChat(id, principal, otherUserChatKey);
    } else {
      const chatKey = await generateSymmetricKey();

      const myChatKey = await encryptAsymmetric(chatKey, await getMyPublicKey());

      const otherUserChatKey = await encryptAsymmetric(chatKey, otherUserPublicKey);

      const response = await (
        await getBackendActor()
      ).createChat(principal, myChatKey, otherUserChatKey);
    }
    setLoading(false);
    setModalVisible(false);
  };

  return (
    <TouchableOpacity
      disabled={loading}
      onPress={() => {
        setModalVisible(false);
      }}
      style={styles.touchableView}
    >
      <View style={styles.container(profile)}>
        {profile ? (
          <View style={styles.profileContainer}>
            <Text style={styles.username}>{profile["username"]}</Text>
            <CustomProfilePicture
              principal={profile["userPrincipal"]}
              style={styles.avatar}
            />
            <Text style={styles.principal}>{principal.toText()}</Text>
            <TouchableOpacity onPress={createChat} style={styles.button}>
              {loading ? (
                <CustomActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>
                  {forAdd ? "Add" : "Create Chat"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <CustomActivityIndicator />
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
  container: (profile) => ({
    backgroundColor: colors.LIGHT_GRAY,
    width: scale(310),
    height: scale(332),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: profile ? "" : "center",
  }),
  profileContainer: {
    alignItems: "center",
  },
  username: {
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
    fontSize: scale(16),
    marginTop: verticalScale(41),
  },
  avatar: {
    height: scale(80),
    aspectRatio: 1,
    borderRadius: scale(80),
    marginTop: verticalScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  principal: {
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
    fontSize: scale(8),
    marginTop: verticalScale(30),
  },
  button: {
    marginTop: verticalScale(40),
    width: scale(280),
    height: scale(50),
    backgroundColor: colors.LIGHT_SECONDARY,
    borderRadius: 15,
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
    fontSize: scale(16),
    textAlign: "center",
  },
});

export default FindBarModalTile;
