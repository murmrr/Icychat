import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { scale, verticalScale } from "../../utility/scalingUtils";
import colors from "../../data/colors";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Principal } from "@dfinity/principal";
import FindBarModalTile from "../FindBarModalTile/FindBarModalTile";
import { Camera } from "expo-camera";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/FontAwesome";

const QRCodeScannerModalTile = ({ id, chatKey, forAdd, setModalVisible }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [otherUserPrincipal, setOtherUserPrincipal] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setModalVisible(false);
      } else {
        setHasPermission(true);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if ((type = BarCodeScanner.Constants.BarCodeType.qr)) {
      try {
        let otherUserPrincipal = Principal.fromText(data);
        setOtherUserPrincipal(otherUserPrincipal);
      } catch (error) {}
    }
  };

  return otherUserPrincipal ? (
    <BlurView intensity={5} tint="dark" style={styles.modalTileContainer}>
      <FindBarModalTile
        id={id}
        chatKey={chatKey}
        principal={otherUserPrincipal}
        forAdd={forAdd}
        setModalVisible={setModalVisible}
      />
    </BlurView>
  ) : (
    <View style={styles.container}>
      <View style={{backgroundColor: "rgba(255, 255, 255, .5)", position: "absolute", zIndex: 1, top: 0, left: 0, right: 0, bottom: verticalScale(555)}}/>
      <View style={{backgroundColor: "rgba(255, 255, 255, .5)", position: "absolute", zIndex: 1, top: verticalScale(368), left: 0, right: 0, bottom: 0}}/>
      <View style={{backgroundColor: "rgba(255, 255, 255, .5)", position: "absolute", zIndex: 1, top: verticalScale(125), left: 0, right: scale(310), bottom: verticalScale(312)}}/>
      <View style={{backgroundColor: "rgba(255, 255, 255, .5)", position: "absolute", zIndex: 1, top: verticalScale(125), left: scale(310), right: 0, bottom: verticalScale(312)}}/>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(false);
        }}
        style={styles.button}
      >
        <Icon name="arrow-left" size={16} color={colors.WHITE} />
      </TouchableOpacity>
      <View style={styles.viewfinder} />
      {hasPermission ? (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={
            otherUserPrincipal ? undefined : handleBarCodeScanned
          }
        />
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 1,
    padding: 12,
    backgroundColor: colors.DARK_GRAY,
    borderRadius: 50,
  },
  viewfinder: {
    width: scale(270),
    height: scale(270),
    position: "absolute",
    top: verticalScale(125),
    borderWidth: 3,
    borderColor: colors.WHITE,
    //tborderRadius: 20,
    borderStyle: "dashed",
    zIndex: 1,
  },
  modalTileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
});

export default QRCodeScannerModalTile;
