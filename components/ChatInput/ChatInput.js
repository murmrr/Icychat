import React, { useRef, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../data/colors";
import { getBackendActor } from "../../lib/actor";
import { scale, verticalScale } from "../../utility/scalingUtils";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import OpenPGP from "react-native-fast-openpgp";
import { encryptSymmetric } from "../../utility/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ed25519KeyIdentity } from "@dfinity/identity";

const ChatInput = ({ id, chatKey, data, setData, pause, setPause }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef();

  const sendMessage = async () => {
    setSending(true);

    const encryptedMessage = await encryptSymmetric(message, chatKey);
    const messageContent = {
      message: encryptedMessage,
    };
    await (await getBackendActor()).sendMessage(id, messageContent);

    const myPrincipal = Ed25519KeyIdentity.fromParsedJson(
      JSON.parse(await AsyncStorage.getItem("@identity"))
    ).getPrincipal();
    const messageId = BigInt(Math.floor(Math.random() * 2 ** 64));
    const time = BigInt(Date.now()) * 1000000n;
    const tempMessage = {
      content: {
        message: encryptedMessage,
      },
      id: messageId,
      sender: myPrincipal,
      time: time,
    };
    const tempData = data;
    tempData["messages"].push(tempMessage);
    setData({ ...data, messages: tempData["messages"] });
    if (pause) {
      setPause((pause) => [...pause, tempMessage]);
    } else {
      setPause([tempMessage]);
    }

    setSending(false);
    inputRef.current.clear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Message"
          placeholderTextColor={colors.GRAY}
          multiline={true}
          editable={!sending}
          onChangeText={setMessage}
          ref={inputRef}
          style={styles.input}
        />
      </View>
      <TouchableOpacity onPress={sendMessage} style={styles.buttonContainer}>
        {sending ? (
          <CustomActivityIndicator />
        ) : (
          <Icon name="send" size={14} color={colors.WHITE} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 24,
    marginHorizontal: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  inputContainer: {
    backgroundColor: "gray",
    flex: 1,
    borderRadius: 15,
    height: 52,
    backgroundColor: colors.LIGHT_GRAY,
  },
  input: {
    color: colors.WHITE,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    width: "100%",
    paddingLeft: 10,
    height: 52,
    borderRadius: 15,
  },
  buttonContainer: {
    borderRadius: 15,
    width: 52,
    height: 52,
    backgroundColor: colors.DARK_PURPLE,
    marginLeft: scale(9),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatInput;
