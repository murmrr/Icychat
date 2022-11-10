import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../data/colors";
import {
  moderateScale,
  scale,
  verticalScale,
} from "../../utility/scalingUtils";
import FindBar from "../FindBar/FindBar";
import ItemDivider from "../ItemDivider/ItemDivider";

const ViewParticipantsModal = ({
  principals,
  modalVisible,
  setModalVisible,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}
          style={styles.touchableView}
        />
        <View style={styles.nestedContainer(principals.length)}>
          <View style={styles.numContainer}>
            <Text style={styles.numText}>
              {principals.length}{" "}
              {principals.length == 1 ? "Participant" : "Participants"}
            </Text>
          </View>
          <ScrollView>
            {[...principals.values()].map((principal, index) => {
              return (
                <>
                  <FindBar principal={principal} />
                  {index < principals.length - 1 ? <ItemDivider /> : <></>}
                </>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  touchableView: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  nestedContainer: (numPrincipals) => ({
    backgroundColor: colors.MIDNIGHT_BLUE,
    borderRadius: 10,
    width: scale(329),
    height:
      verticalScale(20) +
      scale(30) +
      moderateScale(
        numPrincipals < 5
          ? numPrincipals * 64.53 + 2 * numPrincipals * 17.5
          : 390.15
      ),
  }),
  numContainer: {
    backgroundColor: colors.CHAT_BLUE,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  numText: {
    fontFamily: "Poppins-Medium",
    color: colors.WHITE,
    fontSize: scale(18),
    textAlign: "center",
    marginVertical: verticalScale(10),
  },
});

export default ViewParticipantsModal;
