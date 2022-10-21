import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { makeLedgerActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { addToCache, GENERAL_CACHE, getFromCache } from "../../utility/caches";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { computeAccountId, formatE8s, useInterval } from "../../utility/utils";
import AccountIdInput from "../AccountIdInput/AccountIdInput";
import AmountInput from "../AmountInput/AmountInput";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import Icon from "react-native-vector-icons/FontAwesome";
import { useHeaderHeight } from "@react-navigation/elements";

const SendModal = ({ principal, setForSend }) => {
  const [balance, setBalance] = useState(null);
  const [transferFee, setTransferFee] = useState(null);
  const [available, setAvailable] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [amount, setAmount] = useState(null);

  const context = useContext(MainContext);

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    if (balance != null && transferFee != null) {
      if (transferFee > balance) {
        setAvailable(0n);
      } else {
        setAvailable(balance - transferFee);
      }
    }
  }, [balance, transferFee]);

  useEffect(() => {
    let value = getFromCache(GENERAL_CACHE, "@balance");
    if (value) {
      setBalance(BigInt(value));
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
    setBalance(numE8s);
    addToCache(GENERAL_CACHE, "@balance", numE8s.toString());
  }, POLLING_INTERVAL);

  useInterval(async () => {
    const response = await makeLedgerActor(context).transfer_fee({});
    setTransferFee(response["transfer_fee"]["e8s"]);
  }, POLLING_INTERVAL);

  return (
    <View style={styles.container(principal)}>
      <TouchableOpacity
        onPress={() => setForSend(false)}
        style={styles.backButton}
      >
        <Icon
          name="caret-left"
          size={20}
          color={colors.WHITE}
          style={{ padding: 15, paddingRight: 10 }}
        />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      {available != null ? (
        <>
          <View style={styles.availableContainer}>
            <Text style={styles.availableLabelText}>Available</Text>
            <View style={styles.availableNestedContainer}>
              <Image
                source={require("../../assets/icp-token-logo.png")}
                style={styles.icpLogo}
              />
              <Text style={styles.availableText}>{formatE8s(available)}</Text>
            </View>
          </View>
          {!principal ? (
            <AccountIdInput accountId={accountId} setAccountId={setAccountId} />
          ) : (
            <></>
          )}
          <AmountInput
            amount={amount}
            setAmount={setAmount}
            available={available}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </>
      ) : (
        <CustomActivityIndicator />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: (principal) => ({
    backgroundColor: colors.MIDNIGHT_BLUE,
    width: scale(330),
    height: principal ? verticalScale(250) : verticalScale(320),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  }),
  backButton: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
  },
  backButtonText: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: scale(10),
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
    paddingRight: 15,
  },
  availableContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
  availableLabelText: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: scale(10),
    fontFamily: "Poppins-SemiBold",
  },
  availableNestedContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginTop: verticalScale(5),
  },
  icpLogo: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(35),
    backgroundColor: colors.LIGHT_GRAY,
  },
  availableText: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: scale(15),
    fontFamily: "Poppins-SemiBold",
    alignSelf: "center",
    marginLeft: scale(10),
  },
  button: {
    marginTop: verticalScale(25),
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

export default SendModal;
