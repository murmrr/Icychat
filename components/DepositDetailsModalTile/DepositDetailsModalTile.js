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

const DepositDetailsModalTile = ({ principal, setModalVisible }) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(false);
        }}
        style={styles.touchableView}
      />
      <View style={styles.container}>
        <FieldWrapper
          label="Principal"
          data={principal.toText()}
          color={colors.BLUE}
        />
        <FieldWrapper
          label="Account ID"
          data={computeAccountId(principal)}
          color={colors.BLUE}
        />
      </View>
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
    height: scale(300),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DepositDetailsModalTile;
