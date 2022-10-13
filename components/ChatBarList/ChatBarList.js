import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import {
  createBackendActor,
  getBackendActor,
  makeBackendActor,
} from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { parseChatHeaders, stringifyChatHeaders, useInterval } from "../../utility/utils";
import ChatBar from "../ChatBar/ChatBar";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import ItemDivider from "../ItemDivider/ItemDivider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatBarList = () => {
  const [data, setData] = useState(null);

  const context = useContext(MainContext);

  useEffect(async () => {
    let value = await AsyncStorage.getItem("@myChatHeaders");
    if (value) {
      setData(parseChatHeaders(value));
    }
  }, [])

  useInterval(async () => {
    const response = await makeBackendActor(context).getMyChatHeaders();
    if (response["ok"]) {
      setData(response["ok"]);
      await AsyncStorage.setItem("@myChatHeaders", stringifyChatHeaders(response["ok"]));
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
          <CustomActivityIndicator />
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
