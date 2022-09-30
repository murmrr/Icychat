import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { getBackendActor } from "../../lib/actor";
import { verticalScale } from "../../utility/scalingUtils";

const ChatInput = ({ id }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef();

  const sendMessage = async () => {
    const messageContent = {
      message: message,
    };

    setSending(true);
    await getBackendActor().sendMessage(id, messageContent);
    setSending(false);
    inputRef.current.clear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Message"
          editable={!sending}
          onChangeText={setMessage}
          ref={inputRef}
          style={styles.input}
        />
      </View>
      {sending ? (
        <ActivityIndicator />
      ) : (
        <Button title="Send!" onPress={sendMessage} style={styles.send} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 24,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  inputContainer: {
    backgroundColor: "gray",
    flex: 1,
    borderRadius: 10,
  },
  input: {
    width: "100%",
    marginLeft: 10,
    height: verticalScale(30),
  },
  button: {},
});

export default ChatInput;
