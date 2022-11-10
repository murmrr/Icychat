import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { POLLING_INTERVAL } from "../../data/constants";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  GENERAL_CACHE,
  getFromCache,
  isInCache,
} from "../../utility/caches";
import { scale, verticalScale } from "../../utility/scalingUtils";
import {
  decryptAsymmetric,
  parseChatHeaders,
  stringifyChatHeaders,
  useInterval,
} from "../../utility/utils";
import ProfilePictureStack from "../ProfilePictureStack/ProfilePictureStack";

const ChatBubbles = ({
  messageBuffer,
  setMessageBuffer,
  deletedIds,
  setDeletedIds,
}) => {
  const [data, setData] = useState(
    isInCache(GENERAL_CACHE, "@myChatHeaders")
      ? parseChatHeaders(getFromCache(GENERAL_CACHE, "@myChatHeaders"))
      : null
  );

  const navigation = useNavigation();

  const context = useContext(MainContext);

  useInterval(async () => {
    const response = await makeIcychatActor(context).getMyChatHeaders();
    if (response["ok"]) {
      var data = response["ok"];
      for (var i = 0; i < data.length; ++i) {
        if (messageBuffer[data[i]["id"]]) {
          if (data[i]["lastMessage"].length > 0) {
            if (
              data[i]["lastMessage"][0]["time"] <
              messageBuffer[data[i]["id"]][
                messageBuffer[data[i]["id"]].length - 1
              ]["time"]
            ) {
              data[i]["lastMessage"][0] =
                messageBuffer[data[i]["id"]][
                  messageBuffer[data[i]["id"]].length - 1
                ];
            }
          }
        }
      }
      setData(data);
      addToCache(GENERAL_CACHE, "@myChatHeaders", stringifyChatHeaders(data));
    }
  }, POLLING_INTERVAL);

  const backR = scale(350 / 2) - 2 * scale(10);
  const frontR = scale(50);
  const radius = backR - frontR;
  return (
    <View style={styles.container}>
      <View style={styles.nestedContainer}>
        {[
          ...data
            .filter((chat) => !deletedIds.includes(chat.id))
            .sort((a, b) => {
              if (a["lastMessage"].length > 0 && b["lastMessage"].length > 0) {
                return (
                  a["lastMessage"][0]["time"] < b["lastMessage"][0]["time"]
                );
              }
              return 0;
            })
            .values(),
        ].map((chatHeader, index) => {
          const angle = (index * 2 * Math.PI) / data.length;
          return (
            <TouchableOpacity
              onPress={async () => {
                const myChatKey = chatHeader["key"];
                const privateKey = getFromCache(GENERAL_CACHE, "@privateKey");
                const chatKey = await decryptAsymmetric(myChatKey, privateKey);
                navigation.navigate("ConversationScreen", {
                  id: chatHeader["id"],
                  chatKey: chatKey,
                  principals: chatHeader["otherUsers"],
                });
              }}
              style={{
                left: backR - frontR + radius * Math.cos(angle),
                top: backR - frontR + radius * Math.sin(angle),
                width: frontR * 2,
                height: frontR * 2,
                borderRadius: frontR,
                position: "absolute",
              }}
            >
              <ProfilePictureStack
                principals={chatHeader["otherUsers"]}
                width={frontR * 2}
                height={frontR * 2}
                style={{ borderRadius: frontR }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  nestedContainer: {
    top: scale(680 / 2) - (scale(350 / 2) - 2 * scale(10)) - scale(30),
    left: scale(350 / 2) - (scale(350 / 2) - 2 * scale(10)),
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatBubbles;
