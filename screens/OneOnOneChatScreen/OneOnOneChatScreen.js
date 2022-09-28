import React, { useLayoutEffect } from "react";
import { Button, FlatList, View } from "react-native";
import Message from "../../components/Message/Message";

const CustomHeader = () => {
  return <Text>aasdd</Text>;
};

const OneOnOneChatScreen = ({ navigation, route }) => {
  const { chat } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [navigation]);

  const renderItem = ({ item }) => <Message message={item} />;

  const keyExtractor = (item) => item["time"];

  return (
    <FlatList
      data={chat["messages"]}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default OneOnOneChatScreen;
