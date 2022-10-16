import React, { useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import colors from "../../data/colors";
import InputWrapper from "../../components/InputWrapper/InputWrapper";
import Toast from "react-native-root-toast";
import * as Haptics from "expo-haptics";
import WavyBackground from "react-native-wavy-background";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import OpenPGP from "react-native-fast-openpgp";
import { generateAsymmetricKeys } from "../../utility/utils";
import { addToCache, GENERAL_CACHE, storage } from "../../utility/caches";

const SignUpScreen = ({ setIsSignedIn }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);

  const regUsername = /^(?=.{1,16}$)[^ ]+$/;

  const register = async () => {
    if (regUsername.test(username)) {
      setLoading(true);
      const identity = Ed25519KeyIdentity.generate();
      addToCache(GENERAL_CACHE, "@identity", JSON.stringify(identity.toJSON()));

      const keys = await generateAsymmetricKeys();
      const privateKey = keys["privateKey"];
      addToCache(GENERAL_CACHE, "@privateKey", privateKey);
      const publicKey = keys["publicKey"];

      const profileUpdate = {
        username: username,
      };
      const response = await makeBackendActor(identity).register(
        profileUpdate,
        publicKey
      );
      setLoading(false);
      setIsSignedIn(true);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setShowInvalid(true);
      setTimeout(() => setShowInvalid(false), 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-10}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.wavyContainer}>
            <WavyBackground
              height={verticalScale(150)}
              width={scale(1100)}
              amplitude={25}
              frequency={2}
              offset={150}
              color={colors.BLUE}
              top
            />
          </View>
          <InputWrapper label="Username">

          {showInvalid ? (
        <>
          <View style={styles.invalid}>
            <Text style={styles.invalidText}>Invalid Username!</Text>
          </View>
          <View style={styles.invalidTriangle} />
        </>
      ) : (
        <></>
      )}
            <TextInput
              placeholder="Pick a username"
              editable={!loading}
              onChangeText={setUsername}
              style={styles.usernameInput}
              autoCapitalize="none"
            />
          </InputWrapper>
          <TouchableOpacity
            disabled={loading}
            onPress={register}
            style={styles.button}
          >
            {loading ? (
              <CustomActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.DARK_PRIMARY,
  },
  wavyContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  invalid: {
    position: "absolute",
    backgroundColor: colors.BLUE,
    width: scale(90),
    height: scale(30),
    borderRadius: 4,
    left: scale(27.5 - 13),
    top: scale(-52),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  invalidText: {
    color: colors.WHITE,
    fontSize: scale(9),
    fontFamily: "Poppins-Medium",
    zIndex: 0,
  },
  invalidTriangle: {
    borderTopWidth: scale(15),
    borderRightWidth: scale(15),
    borderBottomWidth: 0,
    borderLeftWidth: scale(15),
    borderTopColor: colors.BLUE,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
    left: scale(23.5 + 25 + 8 - 13),
    top: scale(-24),
  },
  usernameInput: {
    height: "100%",
    width: "90%",
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    paddingLeft: 31,
    paddingRight: 12,
  },
  button: {
    marginTop: scale(19),
    marginBottom: scale(48),
    backgroundColor: colors.BLUE,
    width: scale(304),
    height: scale(40),
    alignSelf: "center",
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.WHITE,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
});

export default SignUpScreen;
