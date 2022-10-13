import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
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
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import { parseConversation, stringifyConversation, useInterval } from "../../utility/utils";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { addToCache, CONVERSATION_CACHE, getFromCache } from "../../utility/caches";

const ConversationScreen = ({ navigation, route }) => {
  const { id, chatKey, principals } = route.params;
  const [data, setData] = useState(null);

  const context = useContext(MainContext);

  const insets = useSafeAreaInsets();

  useEffect(async () => {
    let value = await getFromCache(CONVERSATION_CACHE, id.toString());
    if (value) {
      setData(parseConversation(value));
    }
  }, [])

  useInterval(async () => {
    const response = await makeBackendActor(context).getMyChat(id);
    if (response["ok"]) {
      setData(response["ok"]);
      await addToCache(CONVERSATION_CACHE, id.toString(), stringifyConversation(response["ok"]));
    }
  }, POLLING_INTERVAL);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <CustomHeader principals={principals} />,
      headerLeft: (props) => <CustomBackButton navigation={navigation} />,
      headerRight: (props) => (
        <AddToChatButton id={id} chatKey={chatKey} navigation={navigation} />
      ),
      headerStyle: {
        backgroundColor: colors.BLUE,
      },
    });

    navigation.getParent().setOptions({
      tabBarStyle: {
        display: "none",
      },
    });

    return () => {
      navigation.getParent().setOptions({
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: colors.BLUE,
        },
        headerTitleStyle: {
          color: "#FFFFFF",
          fontSize: 20,
          fontFamily: "Poppins-Medium",
        },
        tabBarStyle: {
          backgroundColor: colors.BLUE,
          position: "absolute",
          left: 24,
          right: 24,
          bottom: insets.bottom == 0 ? 24 : insets.bottom,
          elevation: 0,
          borderRadius: 35,
          height: 60,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
        headerShadowVisible: false,
      });
    };
  }, []);

  const renderItem = ({ item }) => <Message message={item} chatKey={chatKey} />;

  const keyExtractor = (item) => item["id"];

  return data ? (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
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
        <ChatInput id={id} chatKey={chatKey} />
      </KeyboardAvoidingView>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <CustomActivityIndicator />
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

export default ConversationScreen;
