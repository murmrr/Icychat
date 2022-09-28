import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";
import ChatBar from "../ChatBar/ChatBar";

const ChatBarList = () => {
  const [data, setData] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getMyChats();
    if (response["ok"]) {
      setData(response["ok"]);
    } else if (response["#err"]) {
      setData(null);
    }
  }, POLLING_INTERVAL);

  const renderItem = ({ item }) => <ChatBar chat={item} />;

  const keyExtractor = (item) => item["otherUsers"][0];

  return data ? (
    <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
  ) : (
    <ActivityIndicator />
  );
};

export default ChatBarList;
