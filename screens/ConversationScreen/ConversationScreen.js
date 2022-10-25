import { useHeaderHeight } from "@react-navigation/elements";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddToChatButton from "../../components/AddToChatButton/AddToChatButton";
import ChatInput from "../../components/ChatInput/ChatInput";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import Message from "../../components/Message/Message";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { makeBackendActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  CONVERSATION_CACHE,
  getFromCache,
} from "../../utility/caches";
import {
  parseConversation,
  stringifyConversation,
  useInterval,
} from "../../utility/utils";

const ConversationScreen = ({ navigation, route }) => {
  const { id, chatKey, principals } = route.params;
  const [data, setData] = useState(null);
  const [messageBuffer, setMessageBuffer] = useState([]);
  const [justUpdated, setJustUpdated] = useState(false);

  const context = useContext(MainContext);

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  useEffect(async () => {
    let value = getFromCache(CONVERSATION_CACHE, id.toString());
    if (value) {
      setData(parseConversation(value));
    }
  }, []);

  useInterval(async () => {
    let response = await makeBackendActor(context).getMyChat(id);
    if (response["ok"]) {
      const myIndexOf = (arr, elem) => {
        for (let i = 0; i < arr.length; ++i) {
          if (arr[i]["content"]["message"] == elem["content"]["message"]) {
            return i;
          }
        }
        return -1;
      };
      let notContained = [];
      for (let i = 0; i < messageBuffer.length; ++i) {
        if (myIndexOf(response["ok"]["messages"], messageBuffer[i]) == -1) {
          notContained.push(messageBuffer[i]);
          break;
        }
      }

      /*
      if (notContained.length == 0) {
        setMessageBuffer([])
      } else {
        notContained.forEach((temp) => {
          response["ok"]["messages"].push(temp)
        })
      }
      */

      setData(response["ok"]);
      addToCache(
        CONVERSATION_CACHE,
        id.toString(),
        stringifyConversation(response["ok"])
      );
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
        keyboardVerticalOffset={headerHeight}
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
        <ChatInput
          id={id}
          chatKey={chatKey}
          messageBuffer={messageBuffer}
          setMessageBuffer={setMessageBuffer}
        />
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
