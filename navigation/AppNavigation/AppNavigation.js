import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GENERAL_CACHE, getFromCache } from "../../utility/caches";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import MainNavigation from "../MainNavigation/MainNavigation";

const AppNavigation = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [identity, setIdentity] = useState(null);

  useEffect(async () => {
    try {
      let value = getFromCache(GENERAL_CACHE, "@identity");
      if (value != null) {
        setIsSignedIn(true);
      }
    } catch (error) {}
  }, []);

  useEffect(async () => {
    if (isSignedIn) {
      let value = getFromCache(GENERAL_CACHE, "@identity");
      setIdentity(Ed25519KeyIdentity.fromParsedJson(JSON.parse(value)));
    } else {
      setIdentity(null);
    }
  }, [isSignedIn]);

  return (
    <SafeAreaProvider>
      {isSignedIn ? (
        identity ? (
          <MainNavigation identity={identity} setIsSignedIn={setIsSignedIn} />
        ) : (
          <></>
        )
      ) : (
        <AuthNavigation setIsSignedIn={setIsSignedIn} />
      )}
    </SafeAreaProvider>
  );
};

export default AppNavigation;
