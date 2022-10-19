import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Modal,
} from "react-native";
import { scale, verticalScale } from "../../utility/scalingUtils";
import colors from "../../data/colors";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import RNQRGenerator from "rn-qr-generator";
import { Principal } from "@dfinity/principal";
import {
  parseProfile,
  stringifyProfile,
  useInterval,
} from "../../utility/utils";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import {
  addToCache,
  GENERAL_CACHE,
  getFromCache,
  PROFILE_CACHE,
  storage,
} from "../../utility/caches";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

const QRCodeModal = ({ modalVisible, setModalVisible }) => {
  const [uri, setUri] = useState(null);
  const [profile, setProfile] = useState(null);

  const context = useContext(MainContext);

  useEffect(async () => {
    let temp = getFromCache(PROFILE_CACHE, context);
    if (temp) {
      setProfile(parseProfile(temp));
    } else {
      const response = await makeBackendActor(context).getMyProfile();
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
  touchableView: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
