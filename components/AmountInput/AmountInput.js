import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { formatE8s } from "../../utility/utils";
import InputWrapper from "../InputWrapper/InputWrapper";

const AmountInput = ({ amount, setAmount, available }) => {
  const onChangeAmount = (amount) => {
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;

    if (amount == "") {
      setAmount(amount);
      return;
    }

    if (!isNaN(parseFloat(amount)) && isFinite(amount)) {
      const numeric = parseFloat(amount);
      if (numeric >= 0.0 && numeric < formatE8s(available)) {
        setAmount(amount);
      }
    }
  };

  return (
    <InputWrapper
      label={"Amount"}
      color={colors.LIGHT_GRAY}
      style={styles.wrapper}
    >
      <View style={styles.nestedContainer}>
        <TextInput
          placeholder="0.00000000"
          placeholderTextColor={colors.GRAY}
          value={amount}
          onChangeText={onChangeAmount}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setAmount(String(formatE8s(available)))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>MAX</Text>
        </TouchableOpacity>
        <Text style={styles.name}>ICP</Text>
      </View>
    </InputWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 4,
    marginHorizontal: scale(5),
  },
  nestedContainer: {
    flex: 1,
    marginHorizontal: scale(13),
    flexDirection: "row",
  },
  input: {
    height: verticalScale(25),
    flex: 1,
    fontSize: scale(18),
    color: colors.WHITE,
  },
  button: {
    backgroundColor: colors.GRAY,
    marginHorizontal: scale(5),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    alignSelf: "center",
    color: colors.WHITE,
    fontFamily: "Poppins-SemiBold",
    fontSize: scale(18),
    flex: 1,
  },
  name: {
    alignSelf: "center",
    color: colors.GRAY,
    fontFamily: "Poppins-SemiBold",
    fontSize: scale(15),
    marginHorizontal: scale(5),
  },
});

export default AmountInput;
