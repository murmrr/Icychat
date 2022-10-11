import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { scale, verticalScale } from "../../utility/scalingUtils";
import colors from "../../data/colors";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import RNQRGenerator from "rn-qr-generator";
import { Principal } from "@dfinity/principal";
import { useInterval } from "../../utility/utils";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import { addToCache, getFromCache, PROFILE_CACHE } from "../../utility/caches";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";

const QRCodeModalTile = ({ setModalVisible }) => {
  const [uri, setUri] = useState(null);
  const [profile, setProfile] = useState(null);

  const context = useContext(MainContext);

  useEffect(async () => {
    let temp = await getFromCache(PROFILE_CACHE, "@myProfile");
    if (temp) {
      setProfile(temp);
    } else {
      const response = await makeBackendActor(context).getMyProfile();
      setProfile(response["ok"]);
      await addToCache(PROFILE_CACHE, "@myProfile", response["ok"]);
    }
  }, []);

  useEffect(async () => {
    try {
      let value = await AsyncStorage.getItem("@identity");
      if (value != null) {
        let identity = Ed25519KeyIdentity.fromParsedJson(JSON.parse(value))
          .getPrincipal()
          .toText();

        const encrypted = Ed25519KeyIdentity.fromParsedJson(JSON.parse(value))
          .getPrincipal()
          .toText();

        const { uri, width, height, base64 } = await RNQRGenerator.generate({
          value: identity,
          height: 280,
          width: 280,
        });
        setUri(uri);
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
      <View style={styles.container}>
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

export default QRCodeModalTile;
