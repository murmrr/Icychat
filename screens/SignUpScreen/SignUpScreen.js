import React, { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { verticalScale } from "../../utility/scalingUtils";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendActor } from "../../lib/actor";

const SignUpScreen = ({ setIsSignedIn }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
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
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Message"
        editable={!loading}
        onChangeText={setUsername}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Register" onPress={register} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    textAlign: "center",
    width: "100%",
    marginLeft: 10,
    height: verticalScale(30),
  },
});

export default SignUpScreen;
