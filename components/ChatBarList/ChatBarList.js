import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";
import ChatBar from "../ChatBar/ChatBar";
import ItemDivider from "../ItemDivider/ItemDivider";

const ChatBarList = () => {
  const [data, setData] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getMyChatHeaders();
    if (response["ok"]) {
      setData(response["ok"]);
    } else if (response["#err"]) {
      setData(null);
    }
  }, POLLING_INTERVAL);

  const renderItem = ({ item }) => <ChatBar chatHeader={item} />;

  const keyExtractor = (item) => item["id"];

  return (
    <View style={styles.container}>
      {data ? (
        <FlatList
          data={data.sort((a, b) => {
            if (a["lastMessage"].length > 0 && b["lastMessage"].length > 0) {
              return a["lastMessage"][0]["time"] < b["lastMessage"][0]["time"];
            }
            return 0;
          })}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemDivider}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatBarList;
