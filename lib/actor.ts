import { Actor, HttpAgent, Identity } from "@dfinity/agent";

// @ts-ignore
import { idlFactory, _SERVICE } from "./backend/backend.did";

import { BACKEND_CANISTER_ID, IC_HOST } from "../config";

export const getBackendActor = (identity?: Identity) => {
  const agent = new HttpAgent({
    identity,
    host: IC_HOST,
  });

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: BACKEND_CANISTER_ID!,
  });
};
