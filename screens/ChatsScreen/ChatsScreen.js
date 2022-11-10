import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import ChatBarList from "../../components/ChatBarList/ChatBarList";
import ChatBubbles from "../../components/ChatBubbles/ChatBubbles";
import colors from "../../data/colors";

const ChatsScreen = ({ messageBuffer, setMessageBuffer }) => {
  const [showBubbles, setShowBubbles] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <TouchableOpacity
          onPress={() => {
            setShowBubbles((showBubbles) => !showBubbles);
          }}
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon
            name={showBubbles ? "format-list-bulleted" : "bubble-chart"}
            size={showBubbles ? 25 : 30}
            color={colors.WHITE}
          />
        </TouchableOpacity>
      ),
    });
  }, [showBubbles]);

  return (
    <View style={styles.container}>
      {showBubbles ? (
        <ChatBubbles
          messageBuffer={messageBuffer}
          setMessageBuffer={setMessageBuffer}
          deletedIds={deletedIds}
          setDeletedIds={setDeletedIds}
        />
      ) : (
        <ChatBarList
          messageBuffer={messageBuffer}
          setMessageBuffer={setMessageBuffer}
          deletedIds={deletedIds}
          setDeletedIds={setDeletedIds}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DARK_PRIMARY,
    flex: 1,
  },
});

export default ChatsScreen;
