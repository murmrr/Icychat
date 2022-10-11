import React, { createContext, useEffect, useState } from "react";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import MainNavigation from "../MainNavigation/MainNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ed25519KeyIdentity } from "@dfinity/identity";

const AppNavigation = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [identity, setIdentity] = useState(null);

  useEffect(async () => {
    try {
      let value = await AsyncStorage.getItem("@identity");
      if (value != null) {
        setIsSignedIn(true);
      }
    } catch (error) {}
  }, []);

  useEffect(async () => {
    if (isSignedIn) {
      let value = await AsyncStorage.getItem("@identity");
      setIdentity(Ed25519KeyIdentity.fromParsedJson(JSON.parse(value)));
    }
  }, [isSignedIn]);

  return (
    <SafeAreaProvider>
      {isSignedIn ? (
        <MainNavigation identity={identity} setIsSignedIn={setIsSignedIn} />
      ) : (
        <AuthNavigation setIsSignedIn={setIsSignedIn} />
      )}
    </SafeAreaProvider>
  );
};

export default AppNavigation;
