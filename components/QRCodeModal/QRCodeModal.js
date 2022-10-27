import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNQRGenerator from "rn-qr-generator";
import colors from "../../data/colors";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  GENERAL_CACHE,
  getFromCache,
  isInCache,
  PROFILE_CACHE,
} from "../../utility/caches";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { parseProfile, stringifyProfile } from "../../utility/utils";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const QRCodeModal = ({ modalVisible, setModalVisible }) => {
  const context = useContext(MainContext);

  const [uri, setUri] = useState(null);
  const [profile, setProfile] = useState(
    isInCache(PROFILE_CACHE, context)
      ? parseProfile(getFromCache(PROFILE_CACHE, context))
      : null
  );

  useEffect(async () => {
    if (profile == null) {
      const response = await makeIcychatActor(context).getMyProfile();
      setProfile(response["ok"]);
      addToCache(PROFILE_CACHE, context, stringifyProfile(response["ok"]));
    }
  }, []);

  useEffect(async () => {
    let value = getFromCache(GENERAL_CACHE, "@identity");
    if (value != null) {
      let identity = Ed25519KeyIdentity.fromParsedJson(JSON.parse(value))
        .getPrincipal()
        .toText();

      const { uri } = await RNQRGenerator.generate({
        value: identity,
        height: 280,
        width: 280,
      });
      setUri(uri);
    }
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}
          style={styles.touchableView}
        />
        <View style={styles.nestedContainer}>
          {uri && profile ? (
            <View style={styles.qrContainer}>
              <CustomProfilePicture
                principal={profile["userPrincipal"]}
                style={styles.avatar}
              />
              <Text style={styles.username}>{profile["username"]}</Text>
              <Image
                source={{ uri: uri }}
                style={{ width: scale(190), height: scale(190) }}
              />
            </View>
          ) : (
            <CustomActivityIndicator />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  touchableView: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  nestedContainer: {
    backgroundColor: colors.BLUE,
    width: scale(240),
    height: scale(300),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  avatar: {
    borderRadius: scale(90),
    marginTop: verticalScale(-15),
    width: scale(85),
    width: scale(85),
  },
  username: {
    marginTop: verticalScale(5),
    marginBottom: verticalScale(3),
    textAlign: "center",
    color: colors.WHITE,
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    borderRadius: 15,
    width: scale(225),
    alignSelf: "center",
  },
});

export default QRCodeModal;
