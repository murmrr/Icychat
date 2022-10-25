import { Ed25519KeyIdentity } from "@dfinity/identity";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import BubbleToast from "../../components/BubbleToast/BubbleToast";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import InputWrapper from "../../components/InputWrapper/InputWrapper";
import colors from "../../data/colors";
import { makeBackendActor } from "../../lib/actor";
import { addToCache, GENERAL_CACHE } from "../../utility/caches";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { generateAsymmetricKeys } from "../../utility/utils";

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
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enabled={false}
      >
        <View style={styles.container}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <InputWrapper label="Username">
            <BubbleToast
              text={"Invalid!"}
              fontSize={scale(12)}
              width={scale(60)}
              left={scale(30.5)}
              top={scale(-80)}
              bottom={verticalScale(0)}
              visible={showInvalid}
              setVisible={setShowInvalid}
            />
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
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY,
  },
  wavyContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    width: scale(200),
    height: scale(200),
    marginBottom: verticalScale(30),
    marginTop: verticalScale(-50),
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
    marginTop: verticalScale(16),
    backgroundColor: colors.BLUE,
    width: scale(304),
    height: verticalScale(38),
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
