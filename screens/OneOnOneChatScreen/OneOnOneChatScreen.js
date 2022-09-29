import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import ChatInput from "../../components/ChatInput/ChatInput";
import Message from "../../components/Message/Message";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";

const CustomHeader = () => {
  return <Text>aasdd</Text>;
};

const OneOnOneChatScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [data, setData] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getMyChat(id);
    if (response["ok"]) {
      setData(response["ok"]);
    } else if (response["#err"]) {
      setData(null);
    }
  }, POLLING_INTERVAL);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [navigation]);

  const renderItem = ({ item }) => <Message message={item} />;

  const keyExtractor = (item) => item["id"];

  return data ? (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 100}
        style={styles.keyboardContainer}
      >
        <FlatList
          data={data["messages"].sort((a, b) => {
            return a["time"] > b["time"];
          })}
          extraData={data["messages"]}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        <ChatInput id={id} />
      </KeyboardAvoidingView>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default OneOnOneChatScreen;
