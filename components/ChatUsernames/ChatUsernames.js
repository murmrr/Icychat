import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { addToCache, getFromCache, PROFILE_CACHE } from "../../utility/caches";
import { useInterval } from "../../utility/utils";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";

const ChatUsernamesSingle = ({ principal, style }) => {
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  const context = useContext(MainContext);

  useEffect(async () => {
    let temp = await getFromCache(PROFILE_CACHE, principal);
    if (temp) {
      setOtherUserProfile(temp);
    } else {
      const response = await makeBackendActor(context).getProfile(principal);
      setOtherUserProfile(response["ok"]);
      await addToCache(PROFILE_CACHE, principal, response["ok"]);
    }
  }, []);

  return otherUserProfile ? (
    <Text numberOfLines={1} style={style}>
      {otherUserProfile["username"]}
    </Text>
  ) : (
    <CustomActivityIndicator />
  );
};

const ChatUsernamesMultiple = ({ principals, style }) => {
  const [otherUserProfiles, setOtherUserProfiles] = useState(new Map());

  const context = useContext(MainContext);

  useInterval(async () => {
    principals.forEach(async (principal) => {
      let temp = await getFromCache(PROFILE_CACHE, principal);
      if (temp) {
        setOtherUserProfiles(otherUserProfiles.set(principal.toText(), temp));
      } else {
        const response = await makeBackendActor(context).getProfile(principal);
        setOtherUserProfiles(
          otherUserProfiles.set(principal.toText(), response["ok"])
        );
        await addToCache(PROFILE_CACHE, principal, response["ok"]);
      }
    });
  }, POLLING_INTERVAL);

  return otherUserProfiles.size == principals.length ? (
    <Text numberOfLines={1} style={style}>
      {[...otherUserProfiles.values()].map((profile, index) => {
        return (
          profile["username"] +
          (index == otherUserProfiles.size - 1 ? "" : ", ")
        );
      })}
    </Text>
  ) : (
    <CustomActivityIndicator />
  );
};

const ChatUsernames = ({ principals, style }) => {
  return principals.length == 1 ? (
    <ChatUsernamesSingle principal={principals[0]} style={style} />
  ) : (
    <ChatUsernamesMultiple principals={principals} style={style} />
  );
};

export default ChatUsernames;
