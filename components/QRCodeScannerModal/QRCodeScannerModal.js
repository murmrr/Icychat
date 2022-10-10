import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { scale, verticalScale } from "../../utility/scalingUtils";
import colors from "../../data/colors";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Principal } from "@dfinity/principal";
import FindBarModalTile from "../FindBarModalTile/FindBarModalTile";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";

const QRScannerModal = ({ setModalVisible }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [otherUserPrincipal, setOtherUserPrincipal] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
      } else {
        setModalVisible(false);
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
    <FindBarModalTile
      principal={otherUserPrincipal}
      setModalVisible={setModalVisible}
    />
  ) : (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(false);
      }}
      style={styles.touchableView}
    >
      <View style={styles.container}>
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={
            otherUserPrincipal ? undefined : handleBarCodeScanned
          }
        />
        <Text style={styles.text}>Scan Code</Text>
        <CustomActivityIndicator />
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
    width: scale(200),
    height: scale(100),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Poppins-SemiBold",
    color: colors.WHITE,
    fontSize: scale(25),
    marginBottom: verticalScale(18),
  },
});

export default QRScannerModal;
