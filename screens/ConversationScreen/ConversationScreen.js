import { useHeaderHeight } from "@react-navigation/elements";
import React, { useContext, useLayoutEffect, useState } from "react";
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
import ViewParticipantsModal from "../../components/ViewParticipantsModal/ViewParticipantsModal";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  CONVERSATION_CACHE,
  getFromCache,
  isInCache,
} from "../../utility/caches";
import {
  parseConversation,
  stringifyConversation,
  useInterval,
} from "../../utility/utils";

const ConversationScreen = ({
  navigation,
  route,
  messageBuffer,
  setMessageBuffer,
}) => {
  const { id, chatKey } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [principals, setPrincipals] = useState(route.params.principals);
  const [data, setData] = useState(
    isInCache(CONVERSATION_CACHE, id.toString())
      ? parseConversation(getFromCache(CONVERSATION_CACHE, id.toString()))
      : null
  );

  const context = useContext(MainContext);

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const isMissing = (tempMessage, messages) => {
    for (var i = 0; i < messages.length; ++i) {
      if (
        tempMessage["content"]["message"] == messages[i]["content"]["message"]
      ) {
        return false;
      }
    }
    return true;
  };

  useInterval(async () => {
    let response = await makeIcychatActor(context).getMyChat(id);
    if (response["ok"]) {
      setPrincipals(response["ok"]["otherUsers"]);

      const data = response["ok"];
      const messages = data["messages"];
      const myMessageBuffer = messageBuffer[id];
      var missingMessages = [];
      if (myMessageBuffer) {
        for (var i = 0; i < myMessageBuffer.length; ++i) {
          if (isMissing(myMessageBuffer[i], messages)) {
            missingMessages.push(myMessageBuffer[i]);
          }
        }
      }
      data["messages"] = messages.concat(missingMessages);

      setData(data);
      addToCache(
        CONVERSATION_CACHE,
        id.toString(),
        stringifyConversation(data)
      );
    }
  }, POLLING_INTERVAL);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => (
        <CustomHeader
          principals={principals}
          setModalVisible={setModalVisible}
        />
      ),
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
  }, [principals]);

  const renderItem = ({ item }) => <Message message={item} chatKey={chatKey} />;

  const keyExtractor = (item) => item["id"];

  return data ? (
    <>
      <ViewParticipantsModal
        principals={principals}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View style={styles.container}>
        <KeyboardAvoidingView
          enabled={!modalVisible}
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
    </>
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
