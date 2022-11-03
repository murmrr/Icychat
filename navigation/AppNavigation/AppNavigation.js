import { Ed25519KeyIdentity } from "@dfinity/identity";
import * as Network from "expo-network";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import colors from "../../data/colors";
import NoInternetScreen from "../../screens/NoInternetScreen/NoInternetScreen";
import { GENERAL_CACHE, getFromCache } from "../../utility/caches";
import { useInterval } from "../../utility/utils";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import MainNavigation from "../MainNavigation/MainNavigation";

const AppNavigation = () => {
  const [hasInternet, setHasInternet] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [identity, setIdentity] = useState(null);

  useInterval(async () => {
    const { isConnected } = await Network.getNetworkStateAsync();
    if (isConnected) {
      setHasInternet(true);
    } else {
      setHasInternet(false);
    }
  }, 500);

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
    <SafeAreaProvider style={{ backgroundColor: colors.DARK_PRIMARY }}>
      {hasInternet ? (
        <>
          {isSignedIn ? (
            identity ? (
              <MainNavigation
                identity={identity}
                setIsSignedIn={setIsSignedIn}
              />
            ) : (
              <></>
            )
          ) : (
            <AuthNavigation setIsSignedIn={setIsSignedIn} />
          )}
        </>
      ) : (
        <NoInternetScreen />
      )}
    </SafeAreaProvider>
  );
};

export default AppNavigation;
