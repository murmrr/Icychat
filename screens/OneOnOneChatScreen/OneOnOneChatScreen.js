import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
} from "react-native";
import ChatInput from "../../components/ChatInput/ChatInput";
import Message from "../../components/Message/Message";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { verticalScale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";

const CustomHeader = ({ principal }) => {
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getProfile(principal);
    if (response["ok"]) {
      setOtherUserProfile(response["ok"]);
    } else if (response["#err"]) {
      setOtherUserProfile(null);
    }
  }, POLLING_INTERVAL);

  return otherUserProfile ? (<Text style={styles.headerUsername}>{otherUserProfile["username"]}</Text>) : (<ActivityIndicator />);
};

const OneOnOneChatScreen = ({ navigation, route }) => {
  const { id, principal } = route.params;
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
    navigation.getParent().setOptions({
      //headerTitle: (props) => <CustomHeader principal={principal}/>,
    });
  }, [navigation, data]);

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
        <ChatInput id={id} setData={setData} />
      </KeyboardAvoidingView>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  headerUsername: {
    fontSize: verticalScale(10)
  },
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OneOnOneChatScreen;
