import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../data/colors";
import { getBackendActor } from "../../lib/actor";
import { scale, verticalScale } from "../../utility/scalingUtils";

const ChatInput = ({ id, setData }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef();

  const sendMessage = async () => {
    setSending(true);
    const messageContent = {
      message: message,
    };
    await (await getBackendActor()).sendMessage(id, messageContent);
    const response = await (await getBackendActor()).getMyChat(id);
    if (response["ok"]) {
      setData(response["ok"]);
    } else if (response["#err"]) {
      setData(null);
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
      {sending ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity onPress={sendMessage} style={styles.buttonContainer}>
        </TouchableOpacity>
        
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
    borderRadius: 15,
    height: 52,
    backgroundColor: colors.LIGHT_PRIMARY
  },
  input: {
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
    backgroundColor: colors.EXTRA_LIGHT_PRIMARY,
    marginLeft: scale(9),
  }
});

export default ChatInput;
