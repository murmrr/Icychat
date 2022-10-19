import React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";
import InputWrapper from "../InputWrapper/InputWrapper";

const AccountIdInput = ({ accountId, setAccountId }) => {
  const onChangeAccountId = (accountId) => {
    setAccountId(accountId);
  };

  return (
    <InputWrapper
      label={"Account ID"}
      color={colors.LIGHT_GRAY}
      style={styles.wrapper}
    >
      <View style={styles.nestedContainer}>
        <TextInput
          placeholder="To:"
          placeholderTextColor={colors.GRAY}
          value={accountId}
          onChangeText={onChangeAccountId}
          style={styles.input}
        />
      </View>
    </InputWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 3,
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
    fontSize: scale(14),
    color: colors.WHITE,
  },
});

export default AccountIdInput;
