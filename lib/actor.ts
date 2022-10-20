import { Actor, HttpAgent, Identity } from "@dfinity/agent";

// @ts-ignore
import {
  idlFactory as icychatidlFactory,
  _SERVICE as icychat_SERVICE,
} from "./icychat/Icychat.did";
import {
  idlFactory as ledgeridlFactory,
  _SERVICE as ledger_SERVICE,
} from "./ledger/Ledger.did";

import { ICYCHAT_CANISTER_ID, IC_HOST, LEDGER_CANISTER_ID } from "../config";

export const makeBackendActor = (identity: Identity) => {
  const agent = new HttpAgent({
    identity,
    host: IC_HOST,
  });

  return Actor.createActor<icychat_SERVICE>(icychatidlFactory, {
    agent,
    canisterId: ICYCHAT_CANISTER_ID!,
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
