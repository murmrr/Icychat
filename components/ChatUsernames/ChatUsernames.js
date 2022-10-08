import React, { useState } from "react";
import { Text } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { addToCache, getFromCache, PROFILE_CACHE } from "../../utility/caches";
import { useInterval } from "../../utility/utils";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";

const ChatUsernamesSingle = ({ principal, style }) => {
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  useInterval(async () => {
    let temp = await getFromCache(PROFILE_CACHE, principal);
    if (temp) {
      setOtherUserProfile(temp);
    } else {
      const response = await (await getBackendActor()).getProfile(principal);
      setOtherUserProfile(response["ok"]);
      await addToCache(PROFILE_CACHE, principal, response["ok"]);
    }
  }, POLLING_INTERVAL);

  return otherUserProfile ? (
    <Text style={style}>{otherUserProfile["username"]}</Text>
  ) : (
    <CustomActivityIndicator />
  );
};

const ChatUsernames = ({ principals, style }) => {
  return principals.length == 1 ? (
    <ChatUsernamesSingle principal={principals[0]} style={style} />
  ) : (
    <Text style={style}>{principals.length} People</Text>
  );
};

export default ChatUsernames;
