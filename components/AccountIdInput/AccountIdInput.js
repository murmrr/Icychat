import React, { useCallback, useRef } from "react";
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
  const inputRef = useRef();

  const onChangeAccountId = useCallback((id) => {
    const RE = /[^a-f0-9]$/;

    const cleansed = id.replace(RE, "");
    inputRef.current.setNativeProps({ text: cleansed });
    setAccountId(cleansed);
  }, []);

  return (
    <InputWrapper
      label={"Account ID"}
      color={colors.LIGHT_GRAY}
      style={styles.wrapper}
    >
      <View style={styles.nestedContainer}>
        <TextInput
          autoCapitalize="none"
          placeholder="To:"
          placeholderTextColor={colors.GRAY}
          ref={inputRef}
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
