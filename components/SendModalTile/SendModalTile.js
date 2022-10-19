import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { makeLedgerActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { addToCache, GENERAL_CACHE, getFromCache } from "../../utility/caches";
import { scale, verticalScale } from "../../utility/scalingUtils";
import {
  computeAccountId,
  convertToICP,
  formatE8s,
  formatICP,
  useInterval,
} from "../../utility/utils";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import InputWrapper from "../InputWrapper/InputWrapper";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native-gesture-handler";
import AmountInput from "../AmountInput/AmountInput";
import AccountIdInput from "../AccountIdInput/AccountIdInput";

const SendModalTile = ({ forFreeform, principal, setForSend }) => {
  const [amount, setAmount] = useState(-1n);
  const [transferFee, setTransferFee] = useState(-1n);
  const [available, setAvailable] = useState(-1n);
  const [amountToSend, setAmountToSend] = useState("");
  const [accountId, setAccountId] = useState("");
  const [sending, setSending] = useState(false);

  const context = useContext(MainContext);

  useEffect(() => {
    if (amount != -1 && transferFee != -1) {
      const difference = amount - transferFee;
      if (difference > 0n) {
        setAvailable(difference);
      } else {
        setAvailable(0n);
      }
    }
  }, [amount, transferFee]);

  useEffect(() => {
    let value = getFromCache(GENERAL_CACHE, "@balance");
    if (value) {
      setAmount(BigInt(value));
    }
  }, []);

  useInterval(async () => {
    const accountBalanceArgs = {
      account: [
        ...new Uint8Array(
          Buffer.from(
            computeAccountId(
              Ed25519KeyIdentity.fromJSON(
                JSON.stringify(context)
              ).getPrincipal()
            ),
            "hex"
          )
        ),
      ],
    };
    const response = await makeLedgerActor(context).account_balance(
      accountBalanceArgs
    );
    const numE8s = response["e8s"];
    setAmount(numE8s);
    addToCache(GENERAL_CACHE, "@balance", numE8s.toString());
  }, POLLING_INTERVAL);

  useInterval(async () => {
    const response = await makeLedgerActor(context).transfer_fee({});
    setTransferFee(response["transfer_fee"]["e8s"]);
  }, POLLING_INTERVAL);

  const onChangeAccountId = (id) => {
    setAccountId(id);
  };

  const onChangeAmountToSend = (amount) => {
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;

    if (amount == "") {
      setAmountToSend(amount);
      return;
    }

    if (!isNaN(parseFloat(amount)) && isFinite(amount)) {
      const numeric = parseFloat(amount);
      if (numeric >= 0.0 && numeric < formatE8s(available)) {
        setAmountToSend(amount);
      }
    }
  };

  const onSend = async () => {
    setSending(true);
    var otherAccountId;
    if (forFreeform) {
      otherAccountId = accountId;
    } else {
      otherAccountId = computeAccountId(principal);
    }
    const amount = formatICP(amountToSend);
    const transferArgs = {
      to: [...new Uint8Array(Buffer.from(otherAccountId, "hex"))],
      fee: { e8s: BigInt(transferFee) },
      memo: BigInt(0n),
      from_subaccount: [],
      created_at_time: [],
      amount: { e8s: BigInt(amount) },
    };
    const response = await makeLedgerActor(context).transfer(transferArgs);
    setSending(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        forFreeform ? verticalScale(70) : verticalScale(120)
      }
    >
      <View style={styles.container}>
        {available != -1n ? (
          <>
            <TouchableOpacity
              onPress={() => setForSend(false)}
              style={styles.backButton}
            >
              <Icon
                name="caret-left"
                size={20}
                color={colors.WHITE}
                style={{ padding: 15 }}
              />
            </TouchableOpacity>
            <View style={styles.availableContainer}>
              <Text style={styles.availableText}>Available Balance</Text>
              <View style={styles.balanceContainer}>
                <Image
                  source={require("../../assets/icp-token-logo.png")}
                  style={styles.icpLogo}
                />
                <View style={styles.amountContainer}>
                  {amount != -1n ? (
                    <Text style={styles.amount}>{formatE8s(available)}</Text>
                  ) : (
                    <CustomActivityIndicator />
                  )}
                </View>
              </View>
            </View>
            {forFreeform ? <AccountIdInput /> : <></>}
            <InputWrapper
              label={"Amount"}
              color={colors.LIGHT_GRAY}
              style={styles.wrapper}
            >
              <TextInput
                value={amountToSend}
                keyboardType="decimal-pad"
                onChangeText={onChangeAmountToSend}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setAmountToSend(String(formatE8s(available)))}
                style={styles.maxButton}
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </InputWrapper>
            <TouchableOpacity
              disabled={
                amountToSend == "" ||
                formatICP(amountToSend) == 0n ||
                (forFreeform && accountId == "")
              }
              onPress={onSend}
              style={styles.button}
            >
              {sending ? (
                <CustomActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>Send</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <CustomActivityIndicator />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.LIGHT_GRAY,
    width: scale(330),
    height: verticalScale(250),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  backButton: {
    position: "absolute",
    top: verticalScale(10),
    left: scale(20),
  },
  availableContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  availableText: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: scale(10),
    fontFamily: "Poppins-SemiBold",
  },
  balanceContainer: {
    width: scale(180),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icpLogo: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(35),
    backgroundColor: colors.LIGHT_GRAY,
  },
  amountContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scale(10),
  },
  amount: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: scale(22),
    fontFamily: "Poppins-SemiBold",
  },
  wrapper: {
    marginTop: 0,
  },
  accountIdInput: {
    height: "100%",
    width: "70%",
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    marginLeft: scale(20),
  },
  input: {
    height: "100%",
    width: "70%",
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    marginLeft: scale(20),
    //borderWidth: 1,
  },
  maxButton: {
    alignItems: "center",
    justifyContent: "center",
    //borderWidth: 1,
    marginLeft: scale(8),
    padding: scale(5),
  },
  maxButtonText: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: scale(18),
    fontFamily: "Poppins-SemiBold",
  },
  button: {
    width: scale(280),
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

export default SendModalTile;
