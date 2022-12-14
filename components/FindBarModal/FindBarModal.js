import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import colors from "../../data/colors";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  getFromCache,
  isInCache,
  PROFILE_CACHE,
} from "../../utility/caches";
import { scale, verticalScale } from "../../utility/scalingUtils";
import {
  encryptAsymmetric,
  generateSymmetricKey,
  getMyPublicKey,
  parseProfile,
  stringifyProfile,
} from "../../utility/utils";
import CustomActivityIndicator from "../CustomActivityIndicator/CustomActivityIndicator";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import SendModal from "../SendModal/SendModal";

const FindBarModal = ({ principal, modalVisible, setModalVisible }) => {
  const [profile, setProfile] = useState(
    isInCache(PROFILE_CACHE, principal)
      ? parseProfile(getFromCache(PROFILE_CACHE, principal))
      : null
  );
  const [loadingChat, setLoadingChat] = useState(false);
  const [forSend, setForSend] = useState(false);

  const context = useContext(MainContext);

  useEffect(() => {
    (async () => {
      if (profile == null) {
        const response = await makeIcychatActor(context).getProfile(principal);
        setProfile(response["ok"]);
        addToCache(PROFILE_CACHE, principal, stringifyProfile(response["ok"]));
      }
    })();
  }, []);

  const createChat = async () => {
    setLoadingChat(true);

    const otherUserPublicKey = (
      await makeIcychatActor(context).getPublicKey(principal)
    )["ok"];

    const chatKey = await generateSymmetricKey();

    const myChatKey = await encryptAsymmetric(chatKey, await getMyPublicKey());

    const otherUserChatKey = await encryptAsymmetric(
      chatKey,
      otherUserPublicKey
    );

    const response = await makeIcychatActor(context).createChat(
      principal,
      myChatKey,
      otherUserChatKey
    );

    setLoadingChat(false);
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      avoidKeyboard={true}
    >
      <View style={styles.container}>
        <TouchableOpacity
          disabled={loadingChat}
          onPress={() => {
            setForSend(false);
            setModalVisible(false);
          }}
          style={styles.touchableView}
        />
        {forSend ? (
          <SendModal principal={principal} setForSend={setForSend} />
        ) : (
          <>
            <View style={styles.nestedContainer(profile)}>
              {profile ? (
                <View style={styles.profileContainer}>
                  <CustomProfilePicture
                    principal={principal}
                    style={styles.avatar}
                  />
                  <Text style={styles.username}>{profile["username"]}</Text>
                  <Text style={styles.principal}>{principal.toText()}</Text>
                  <TouchableOpacity onPress={createChat} style={styles.button}>
                    {loadingChat ? (
                      <CustomActivityIndicator />
                    ) : (
                      <Text style={styles.buttonText}>Create Chat</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setForSend(true);
                    }}
                    style={[styles.button, { marginTop: verticalScale(10) }]}
                  >
                    <Text style={styles.buttonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <CustomActivityIndicator />
              )}
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  touchableView: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nestedContainer: (profile) => ({
    backgroundColor: colors.MIDNIGHT_BLUE,
    width: scale(310),
    height: verticalScale(308),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: profile ? "" : "center",
  }),
  profileContainer: {
    alignItems: "center",
  },
  avatar: {
    height: scale(90),
    aspectRatio: 1,
    borderRadius: scale(80),
    marginTop: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  username: {
    fontFamily: "Poppins-SemiBold",
    color: colors.WHITE,
    fontSize: scale(19),
    marginTop: verticalScale(25),
  },
  principal: {
    fontFamily: "Poppins-Regular",
    color: colors.GRAY,
    fontSize: scale(8),
    marginTop: verticalScale(9),
  },
  button: {
    marginTop: verticalScale(30),
    width: scale(280),
    height: verticalScale(48),
    backgroundColor: colors.BLUE,
    borderRadius: 15,
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
    fontSize: scale(16),
    textAlign: "center",
  },
});

export default FindBarModal;
