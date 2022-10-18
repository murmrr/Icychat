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
import InputWrapper from "../InputWrapper/InputWrapper";
import { computeAccountId } from "../../utility/utils";
import FieldWrapper from "../FieldWrapper/FieldWrapper";
import SendModalTile from "../SendModalTile/SendModalTile";

const DepositDetailsModalTile = ({ principal, setModalVisible }) => {
  const [forSend, setForSend] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(false);
        }}
        style={styles.touchableView}
      />
      {forSend ? (
        <SendModalTile forFreeform={true} setForSend={setForSend} />
      ) : (
        <View style={styles.container}>
          <FieldWrapper
            label="Account ID"
            data={computeAccountId(principal)}
            color={colors.BLUE}
          />
          <FieldWrapper
            label="Principal"
            data={principal.toText()}
            color={colors.BLUE}
          />
          <TouchableOpacity
            onPress={() => setForSend(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  touchableView: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 0,
  },
  container: {
    backgroundColor: colors.LIGHT_GRAY,
    width: scale(300),
    height: verticalScale(360),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: scale(260),
    height: verticalScale(48),
    backgroundColor: colors.BLUE,
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

export default DepositDetailsModalTile;
