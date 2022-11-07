import React, { useContext, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from "react-native-vector-icons/FontAwesome5";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  GENERAL_CACHE,
  getFromCache,
  isInCache,
} from "../../utility/caches";
import { scale } from "../../utility/scalingUtils";
import {
  parseChatHeaders,
  stringifyChatHeaders,
  useInterval,
} from "../../utility/utils";
import ChatBar from "../ChatBar/ChatBar";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import ItemDivider from "../ItemDivider/ItemDivider";

const ChatBarList = ({ messageBuffer, setMessageBuffer }) => {
  const [data, setData] = useState(
    isInCache(GENERAL_CACHE, "@myChatHeaders")
      ? parseChatHeaders(getFromCache(GENERAL_CACHE, "@myChatHeaders"))
      : null
  );
  const [deletedIds, setDeletedIds] = useState([]);

  let row = [];
  let prevOpenedRow;

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

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderRowItem = ({ item, index }, onDelete) => {
    const renderRightView = (process, dragX, onDeleteHandler) => {
      const trans = dragX.interpolate({
        inputRange: [0, scale(90)],
        outputRange: [scale(90), scale(180)],
      });

      return (
        <Animated.View
          style={{
            backgroundColor: colors.RED,
            width: scale(90),
            margin: 0,
            transform: [{ translateX: trans }],
          }}
        >
          <TouchableOpacity
            onPress={onDelete}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name="trash-alt" size={20} color={colors.WHITE} />
          </TouchableOpacity>
        </Animated.View>
      );
    };

    return (
      <Swipeable
        renderRightActions={(process, dragX) =>
          renderRightView(process, dragX, onDelete)
        }
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}
        friction={2}
        overshootRight={false}
        rightThreshold={-90}
        leftThreshold={90}
      >
        <ChatBar chatHeader={item} />
      </Swipeable>
    );
  };

  const keyExtractor = (item) => item["id"];

  return (
    <View style={styles.container}>
      {data ? (
        <FlatList
          data={data
            .filter((chat) => !deletedIds.includes(chat.id))
            .sort((a, b) => {
              if (a["lastMessage"].length > 0 && b["lastMessage"].length > 0) {
                return (
                  a["lastMessage"][0]["time"] < b["lastMessage"][0]["time"]
                );
              }
              return 0;
            })}
          renderItem={(v) =>
            renderRowItem(v, async () => {
              setDeletedIds((deletedIds) => [...deletedIds, v.item.id]);
              await makeIcychatActor(context).leaveChat(v.item.id);
            })
          }
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
