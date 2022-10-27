import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { useContext, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { scale } from "../../utility/scalingUtils";
import { encryptSymmetric } from "../../utility/utils";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";

const ChatInput = ({ id, chatKey, messageBuffer, setMessageBuffer }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef();

  const context = useContext(MainContext);

  const sendMessage = async () => {
    if (message != "") {
      setSending(true);

      const encryptedMessage = await encryptSymmetric(message, chatKey);

      const messageContent = {
        message: encryptedMessage,
      };
      const bufferedMessage = {
        content: {
          message: encryptedMessage,
        },
        id: BigInt(messageBuffer.length + 1),
        sender: Ed25519KeyIdentity.fromJSON(
          JSON.stringify(context)
        ).getPrincipal(),
        time: BigInt(Date.now()) * 1000000n,
      };
      setMessageBuffer((messageBuffer) => [...messageBuffer, bufferedMessage]);
      await makeIcychatActor(context).sendMessage(id, messageContent);

      inputRef.current.clear();
      setMessage("");

      setSending(false);
    }
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
      <TouchableOpacity
        disabled={message == ""}
        onPress={sendMessage}
        style={styles.buttonContainer}
      >
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
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    width: "100%",
    paddingLeft: 10,
    height: 52,
    borderRadius: 15,
  },
  buttonContainer: {
    borderRadius: 20,
    width: 52,
    height: 52,
    backgroundColor: colors.DARK_PURPLE,
    marginLeft: scale(9),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatInput;
