import React, { useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";

const ChatUsernamesSingle = ({ principal, style }) => {
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getProfile(principal);
    if (response["ok"]) {
      setOtherUserProfile(response["ok"]);
    } else if (response["#err"]) {
      setOtherUserProfile(null);
    }
  }, POLLING_INTERVAL);

  return otherUserProfile ? (
    <Text style={style}>{otherUserProfile["username"]}</Text>
  ) : (
    <ActivityIndicator />
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
