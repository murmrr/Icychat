import React, { useEffect, useState } from "react";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import MainNavigation from "../MainNavigation/MainNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const AppNavigation = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(async () => {
    try {
      let value = await AsyncStorage.getItem("@identity");
      if (value != null) {
        setIsSignedIn(true);
      }
    } catch (error) {}
  }, []);

  return (
    <SafeAreaProvider>
      {isSignedIn ? (
        <MainNavigation setIsSignedIn={setIsSignedIn} />
      ) : (
        <AuthNavigation setIsSignedIn={setIsSignedIn} />
      )}
    </SafeAreaProvider>
  );
};

export default AppNavigation;
