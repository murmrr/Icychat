import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { computeAccountId } from "../../utility/utils";
import FieldWrapper from "../FieldWrapper/FieldWrapper";
import SendModal from "../SendModal/SendModal";

const DepositDetailsModal = ({ principal, modalVisible, setModalVisible }) => {
  const [forSend, setForSend] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      avoidKeyboard={true}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setForSend(false);
            setModalVisible(false);
          }}
          style={styles.touchableView}
        />
        {forSend ? (
          <SendModal setForSend={setForSend} />
        ) : (
          <View style={styles.nestedContainer}>
            <FieldWrapper
              label="Account ID"
              data={computeAccountId(principal)}
              color={colors.BLUE}
              top={true}
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableView: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 0,
  },
  nestedContainer: {
    backgroundColor: colors.MIDNIGHT_BLUE,
    width: scale(300),
    height: verticalScale(330),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: scale(260),
    height: verticalScale(48),
    marginTop: verticalScale(10),
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

export default DepositDetailsModal;
