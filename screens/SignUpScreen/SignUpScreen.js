import React, { useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendActor } from "../../lib/actor";
import colors from "../../data/colors";
import InputWrapper from "../../components/InputWrapper/InputWrapper";
import Toast from "react-native-root-toast";
import * as Haptics from "expo-haptics";

const SignUpScreen = ({ setIsSignedIn }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const regUsername = /^(?=.{1,16}$)[^ ]+$/;

  const register = async () => {
    if (regUsername.test(username)) {
      setLoading(true);
      const identity = Ed25519KeyIdentity.generate();
  
      await AsyncStorage.setItem("@identity", JSON.stringify(identity.toJSON()));
      const profileUpdate = {
        username: username,
      };
      const response = await (
        await getBackendActor(identity)
      ).register(profileUpdate);
      setLoading(false);
      setIsSignedIn(true);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      const timeToNotify = setTimeout(() => {
        Toast.show("Invalid Username", {
          position: verticalScale(250),
          shadow: true,
          animation: true,
          hideOnPress: true,
          backgroundColor: colors.DARK_PRIMARY,
          textColor: colors.WHITE,
          opacity: 1,
          duration: 250
        });
        clearTimeout(timeToNotify);
      }, 100);
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}
    keyboardShouldPersistTaps='handled'>
          <View style={styles.container}>
              <InputWrapper label="Username">
          <TextInput 
        placeholder="Pick a username"
        editable={!loading}
        onChangeText={setUsername}
        style={styles.usernameInput}
          />
        </InputWrapper>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity onPress={register} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY
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
    marginTop: 50,
    backgroundColor: colors.LIGHT_ORANGE,
    width: scale(200),
    height: scale(40),
    alignSelf: "center",
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.DARK_PRIMARY,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
});

export default SignUpScreen;
