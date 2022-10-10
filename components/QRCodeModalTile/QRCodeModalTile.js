import React, { useEffect, useState } from "react";
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
import {
  encryptAsymmetric,
  generateSymmetricKey,
  getMyPublicKey,
  useInterval,
} from "../../utility/utils";
import colors from "../../data/colors";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import OpenPGP from "react-native-fast-openpgp";
import { addToCache, getFromCache, PROFILE_CACHE } from "../../utility/caches";
//import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";

const QRCodeModalTile = ({ setModalVisible }) => {
  const [myIdentity, setMyIdentity] = useState(null);

  useEffect(async () => {
    try {
      let value = await AsyncStorage.getItem("@identity");
      if (value != null) {
        let identity = Ed25519KeyIdentity.fromParsedJson(JSON.parse(value))
          .getPrincipal()
          .toText();

        setMyIdentity(identity);
      }
    } catch (error) {}
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(false);
      }}
      style={styles.touchableView}
    >
      <View style={styles.container(myIdentity)}>
        {myIdentity ? (
          <View style={styles.myIdentity}>
            {/*<QRCode value={myIdentity} size={scale(250)} />*/}
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
    width: scale(300),
    height: scale(300),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  }),
  myIdentity: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default QRCodeModalTile;
