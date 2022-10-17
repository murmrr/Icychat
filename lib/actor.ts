import { Actor, HttpAgent, Identity } from "@dfinity/agent";

// @ts-ignore
import { idlFactory as backendidlFactory, _SERVICE as backend_SERVICE } from "./backend/CryptchatBackend.did";
import { idlFactory as ledgeridlFactory, _SERVICE as ledger_SERVICE } from "./ledger/Ledger_Candid.did";

import { BACKEND_CANISTER_ID, IC_HOST, LEDGER_CANISTER_ID } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";

export const makeBackendActor = (identity: Identity) => {
  const agent = new HttpAgent({
    identity,
    host: IC_HOST,
  });

  return Actor.createActor<backend_SERVICE>(backendidlFactory, {
    agent,
    canisterId: BACKEND_CANISTER_ID!,
  });
};

export const makeLedgerActor = (identity: Identity) => {
  const agent = new HttpAgent({
    identity,
    host: IC_HOST,
  });

  return Actor.createActor<ledger_SERVICE>(ledgeridlFactory, {
    agent,
    canisterId: LEDGER_CANISTER_ID!,
  });
};

