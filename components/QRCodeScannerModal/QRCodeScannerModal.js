import { Principal } from "@dfinity/principal";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";
import AddToChatModal from "../AddToChatModal/AddToChatModal";
import FindBarModal from "../FindBarModal/FindBarModal";

const QRCodeScannerModal = ({
  id,
  chatKey,
  forAdd,
  modalVisible,
  setModalVisible,
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [otherUserPrincipal, setOtherUserPrincipal] = useState(false);

  useEffect(() => {
    setOtherUserPrincipal(false);
  }, [modalVisible]);

  useEffect(() => {
    if (modalVisible) {
      const getBarCodeScannerPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== "granted") {
          setModalVisible(false);
        } else {
          setHasPermission(true);
        }
      };

      getBarCodeScannerPermissions();
    }
  }, [modalVisible]);

  const handleBarCodeScanned = ({ type, data }) => {
    if ((type = BarCodeScanner.Constants.BarCodeType.qr)) {
      try {
        let otherUserPrincipal = Principal.fromText(data);
        setOtherUserPrincipal(otherUserPrincipal);
      } catch (error) {}
    }
  };
  return otherUserPrincipal ? (
    forAdd ? (
      <AddToChatModal
        id={id}
        chatKey={chatKey}
        principal={otherUserPrincipal}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    ) : (
      <FindBarModal
        principal={otherUserPrincipal}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    )
  ) : (
    <Modal transparent={true} visible={modalVisible}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, .5)",
            position: "absolute",
            zIndex: 1,
            top: 0,
            left: 0,
            right: 0,
            bottom: verticalScale(555),
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, .5)",
            position: "absolute",
            zIndex: 1,
            top: verticalScale(368),
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, .5)",
            position: "absolute",
            zIndex: 1,
            top: verticalScale(125),
            left: 0,
            right: scale(310),
            bottom: verticalScale(312),
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, .5)",
            position: "absolute",
            zIndex: 1,
            top: verticalScale(125),
            left: scale(310),
            right: 0,
            bottom: verticalScale(312),
          }}
        />
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 1,
    padding: 12,
    backgroundColor: colors.DARK_PRIMARY,
    borderRadius: 50,
  },
  viewfinder: {
    width: scale(270),
    height: scale(270),
    position: "absolute",
    top: verticalScale(125),
    borderWidth: 3,
    borderColor: colors.WHITE,
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

export default QRCodeScannerModal;
