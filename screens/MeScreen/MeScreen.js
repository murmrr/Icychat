import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import UserAvatar from "react-native-user-avatar";
import InputWrapper from "../../components/InputWrapper/InputWrapper";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { scale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MeScreen = ({ setIsSignedIn }) => {
  const [profile, setProfile] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getMyProfile();
    if (response["ok"]) {
      setProfile(response["ok"]);
    } else if (response["#err"]) {
      setProfile(null);
    }
  }, POLLING_INTERVAL);


  const handleDelete = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@identity");
              setIsSignedIn(false);
          }
          catch(exception) {}
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
    behavior="padding"
    enabled
    keyboardVerticalOffset={100}>
      {profile ? (
    <ScrollView
      style={{ backgroundColor: colors.DARK_PRIMARY }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.avatarContainer}>
        <UserAvatar name={profile["username"]} style={styles.avatar} />
      </View>
      <View style={styles.textContainer}>
        <InputWrapper label="Principal">
          <TextInput 
            value={profile["userPrincipal"].toText()}
            editable={false}
            style={styles.principalInput}
          />
        </InputWrapper>
        <InputWrapper label="Username">
          <TextInput 
            value={profile["username"]}
            editable={false}
            style={styles.usernameInput}
          />
        </InputWrapper>
      </View>
      <TouchableOpacity onPress={handleDelete} style={styles.button}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY,
  },
  avatarContainer: {
    width: scale(121),
    aspectRatio: 1,
    marginTop: 30,
  },
  avatar: {
    flex: 1,
    borderRadius: scale(90),
  },
  textContainer: {
    alignSelf: "center",
  },
  principalInput: {
    height: "100%",
    width: "90%",
    color: colors.WHITE,
    fontSize: 6.5,
    fontFamily: "Poppins-Regular",
    paddingLeft: 31,
    paddingRight: 12,
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
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY,
  },
});

export default MeScreen;
