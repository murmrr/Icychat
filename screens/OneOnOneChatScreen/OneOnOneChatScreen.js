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
import colors from "../../data/colors";
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

  return otherUserProfile ? (
    <Text style={styles.headerUsername}>{otherUserProfile["username"]}</Text>
  ) : (
    <ActivityIndicator />
  );
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

  /*
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent.setOptions({
      headerTitle: (props) => <CustomHeader principal={principal}/>,
      tabBarStyle: {
        display: "none",
      },
    });

    return () => {
      parent.setOptions({
        headerTitle: () => <Text>Chats</Text>,
        tabBarStyle: {}
      });
    };
  }, [navigation]);
  */

  const renderItem = ({ item }) => <Message message={item} />;

  const keyExtractor = (item) => item["id"];

  return data ? (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
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
  container: {
    flex: 1,
    backgroundColor: colors.DARK_PRIMARY,
  },
  keyboardContainer: {
    flex: 1,
  },
  headerUsername: {
    fontSize: verticalScale(10),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY
  },
});

export default OneOnOneChatScreen;
