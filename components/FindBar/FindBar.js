import React, { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { moderateScale, scale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import FindBarModalTile from "../FindBarModalTile/FindBarModalTile";
import colors from "../../data/colors";
import { BlurView } from "expo-blur";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";

const FindBar = ({ id, principal, forAdd }) => {
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
        <BlurView intensity={5} tint="dark" style={styles.modalTileContainer}>
          <FindBarModalTile
            id={id}
            principal={principal}
            forAdd={forAdd}
            setModalVisible={setModalVisible}
          />
        </BlurView>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <CustomProfilePicture principal={principal} style={styles.avatar} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.usernameContainer}>
              {profile ? (
                <Text style={styles.username}>{profile["username"]}</Text>
              ) : (
                <CustomActivityIndicator />
              )}
            </View>
            <Text style={styles.principal}>{principal.toText()}</Text>
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
    height: moderateScale(64.53),
    marginHorizontal: moderateScale(26),
    marginVertical: moderateScale(17.5),
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "20%",
    height: "100%",
  },
  avatar: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 100,
  },
  textContainer: {
    flex: 1,
    marginLeft: moderateScale(9.5),
  },
  usernameContainer: { alignItems: "flex-start" },
  username: {
    color: colors.WHITE,
    fontSize: moderateScale(18),
    fontFamily: "Poppins-Medium",
  },
  principal: {
    fontSize: moderateScale(6),
    color: colors.GRAY,
    fontFamily: "Poppins-Regular",
  },
});

export default FindBar;
