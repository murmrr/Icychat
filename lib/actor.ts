import { Actor, HttpAgent, Identity } from "@dfinity/agent";

// @ts-ignore
import { idlFactory, _SERVICE } from "./backend/backend.did";

import { BACKEND_CANISTER_ID, IC_HOST } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";

export const createBackendActor = (identity?: Identity) => {
  const agent = new HttpAgent({
    identity,
    host: IC_HOST,
  });

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: BACKEND_CANISTER_ID!,
  });
};

export const getBackendActor = async (identity?: Identity) => {
  try {
    let value = await AsyncStorage.getItem("@identity");
    if (value != null) {
      return createBackendActor(
        Ed25519KeyIdentity.fromParsedJson(JSON.parse(value))
      );
    } else {
      return createBackendActor();
    }
  } catch (error) {
    return createBackendActor();
  }
};
