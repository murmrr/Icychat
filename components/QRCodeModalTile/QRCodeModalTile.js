import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { scale } from "../../utility/scalingUtils";
import colors from "../../data/colors";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import RNQRGenerator from "rn-qr-generator";
import { Principal } from "@dfinity/principal";

const QRCodeModalTile = ({ setModalVisible }) => {
  const [uri, setUri] = useState(null);

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
        {uri ? (
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: uri }}
              style={{ width: scale(280), height: scale(280) }}
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
    width: scale(300),
    height: scale(300),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default QRCodeModalTile;
