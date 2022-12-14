import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Placeholder, PlaceholderLine, PlaceholderMedia } from "rn-placeholder";
import colors from "../../data/colors";
import { makeIcychatActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  getFromCache,
  isInCache,
  PROFILE_CACHE,
} from "../../utility/caches";
import { moderateScale, verticalScale } from "../../utility/scalingUtils";
import { parseProfile, stringifyProfile } from "../../utility/utils";
import AddToChatModal from "../AddToChatModal/AddToChatModal";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import FindBarModal from "../FindBarModal/FindBarModal";

const FindBar = ({ id, chatKey, principal, forAdd }) => {
  const [profile, setProfile] = useState(
    isInCache(PROFILE_CACHE, principal)
      ? parseProfile(getFromCache(PROFILE_CACHE, principal))
      : null
  );
  const [modalVisible, setModalVisible] = useState(false);

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

  return profile ? (
    <>
      {forAdd ? (
        <AddToChatModal
          id={id}
          chatKey={chatKey}
          principal={principal}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      ) : (
        <FindBarModal
          principal={principal}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <CustomProfilePicture principal={principal} style={styles.avatar} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{profile["username"]}</Text>
            </View>
            <Text style={styles.principal}>{principal.toText()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  ) : (
    <>
      <Placeholder>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <PlaceholderMedia
              style={[styles.avatar, { backgroundColor: colors.LIGHT_GRAY }]}
              size={350 / 5}
            />
          </View>
          <View style={styles.textContainer}>
            <PlaceholderLine
              style={[
                styles.username,
                {
                  marginBottom: verticalScale(5),
                  marginTop: verticalScale(1),
                  backgroundColor: colors.LIGHT_GRAY,
                },
              ]}
              width={30}
              height={moderateScale(18)}
            />
            <PlaceholderLine
              style={[styles.principal, { backgroundColor: colors.LIGHT_GRAY }]}
              width={80}
              height={moderateScale(6)}
            />
          </View>
        </View>
      </Placeholder>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: moderateScale(64.53),
    marginHorizontal: moderateScale(26),
    marginVertical: moderateScale(17.5),
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "20%",
    height: "100%",
  },
  avatar: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 100,
  },
  textContainer: {
    flex: 1,
    marginLeft: moderateScale(9.5),
  },
  usernameContainer: { alignItems: "flex-start" },
  username: {
    color: colors.WHITE,
    fontSize: moderateScale(18),
    fontFamily: "Poppins-Medium",
  },
  principal: {
    fontSize: moderateScale(6),
    color: colors.GRAY,
    fontFamily: "Poppins-Regular",
  },
});

export default FindBar;
