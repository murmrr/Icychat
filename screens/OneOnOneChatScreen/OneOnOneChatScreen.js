import React, { useEffect, useLayoutEffect, useState } from "react";
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
import AddToChatButton from "../../components/AddToChatButton/AddToChatButton";
import ChatInput from "../../components/ChatInput/ChatInput";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import Message from "../../components/Message/Message";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";
import { useIsFocused } from "@react-navigation/native";

const OneOnOneChatScreen = ({ navigation, route }) => {
  const { id, principals } = route.params;
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
      headerTitle: (props) => <CustomHeader principals={principals} />,
      headerLeft: (props) => <CustomBackButton navigation={navigation} />,
      headerRight: (props) => <AddToChatButton id={id} navigation={navigation}/>,
      headerStyle: {
        backgroundColor: colors.LIGHT_PRIMARY,
        height: 110,
      },
    });

    navigation.getParent().setOptions({
      tabBarStyle: {
        display: "none",
      },
    })

    return () => {
      navigation.getParent().setOptions({
        headerStyle: {
          backgroundColor: colors.LIGHT_PRIMARY,
          height: 110,
        },
        headerTitleStyle: {
          color: "#FFFFFF",
          fontSize: 20,
          fontFamily: "Poppins-Medium",
        },
        tabBarStyle: {
          backgroundColor: colors.LIGHT_PRIMARY,
          borderTopWidth: 0,
        },
        headerShadowVisible: false,
      })
    }
  }, []);

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
            return a["time"] < b["time"];
          })}
          inverted={true}
          extraData={data["messages"]}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.messagesContainer}
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
  messagesContainer: {
    marginBottom: 39,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY,
  },
});

export default OneOnOneChatScreen;
