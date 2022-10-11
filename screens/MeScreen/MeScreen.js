import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import InputWrapper from "../../components/InputWrapper/InputWrapper";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor, makeBackendActor } from "../../lib/actor";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomProfilePicture from "../../components/CustomProfilePicture/CustomProfilePicture";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import { clearAllCaches } from "../../utility/caches";
import Toast from "react-native-root-toast";
import * as Haptics from "expo-haptics";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";

const MeScreen = ({ setIsSignedIn }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editingLoading, setEditingLoading] = useState(false);
  const [newUsername, setNewUsername] = useState(null);

  const context = useContext(MainContext);

  const regUsername = /^(?=.{1,16}$)[^ ]+$/;

  useInterval(async () => {
    if (!editing) {
      const response = await makeBackendActor(context).getMyProfile();
      setProfile(response["ok"]);
    }
  }, POLLING_INTERVAL);

  const handleEdit = async () => {
    if (!editing) {
      setNewUsername(profile["username"]);
    } else {
      if (regUsername.test(newUsername)) {
        if (newUsername != profile["username"]) {
          setEditingLoading(true);
          const profileUpdate = {
            username: newUsername,
          };
          const response = await makeBackendActor(context).updateProfile(
            profileUpdate
          );

          const newProfile = profile;
          newProfile["username"] = newUsername;
          setProfile(newProfile);
          await new Promise((r) => setTimeout(r, 1.5 * POLLING_INTERVAL));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setEditingLoading(false);
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const timeToNotify = setTimeout(() => {
          Toast.show("Invalid Username", {
            position: verticalScale(125),
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: colors.DARK_PRIMARY,
            textColor: colors.WHITE,
            opacity: 1,
            duration: 250,
          });
          clearTimeout(timeToNotify);
        }, 100);
      }
    }
    setEditing(!editing);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to burn your account?",
      [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await clearAllCaches();
              await AsyncStorage.removeItem("@identity");
              await AsyncStorage.removeItem("@privateKey");
              setIsSignedIn(false);
            } catch (exception) {}
          },
        },
      ]
    );
  };

  return profile ? (
    <ScrollView
      style={{ backgroundColor: colors.DARK_PRIMARY }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <CustomProfilePicture
            principal={profile["userPrincipal"]}
            style={styles.avatar}
          />
        </View>
        <View style={styles.textContainer}>
          <TextInput
            numberOfLines={1}
            value={editing ? newUsername : profile["username"]}
            onChangeText={(text) => setNewUsername(text)}
            style={styles.usernameInput(editing)}
            editable={editing && !editingLoading}
            autoCapitalize="none"
          ></TextInput>
          <Text style={styles.principalInput}>
            {profile["userPrincipal"].toText()}
          </Text>
        </View>
        {/*
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            {editingLoading ? (
              <CustomActivityIndicator />
            ) : (
              <Text style={styles.editButtonText}>
                {editing ? "Done" : "Edit Profile"}
              </Text>
            )}
          </TouchableOpacity>
            */}
      </View>
      <TouchableOpacity onPress={handleDelete} style={styles.button}>
        <Text style={styles.buttonText}>Burn</Text>
        <Icon name="fire" size={14} color={colors.WHITE} />
      </TouchableOpacity>
    </ScrollView>
  ) : (
    <View style={styles.loadingContainer}>
      <CustomActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.DARK_PRIMARY,
  },
  profileContainer: {
    marginTop: verticalScale(100),
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    width: scale(121),
    aspectRatio: 1,
  },
  avatar: {
    flex: 1,
    borderRadius: scale(90),
  },
  textContainer: {
    alignSelf: "center",
  },
  usernameInput: (editable) => ({
    textAlign: "center",
    color: colors.WHITE,
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginTop: verticalScale(6),
    borderWidth: 2,
    borderColor: editable ? colors.GRAY : colors.DARK_GRAY,
    borderRadius: 15,
    width: scale(225),
    alignSelf: "center",
  }),
  principalInput: {
    textAlign: "center",
    color: colors.GRAY,
    fontSize: 9,
    fontFamily: "Poppins-Regular",
    marginTop: verticalScale(6),
  },
  editButton: {
    marginTop: verticalScale(25),
    backgroundColor: colors.DARK_PURPLE,
    width: scale(135),
    height: scale(38),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  editButtonText: {
    color: colors.WHITE,
    fontFamily: "Poppins-Medium",
    fontSize: scale(13),
  },
  button: {
    marginBottom: verticalScale(150),
    backgroundColor: colors.RED,
    width: scale(152),
    height: scale(40),
    alignSelf: "center",
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.WHITE,
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    marginRight: scale(10),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK_PRIMARY,
  },
});

export default MeScreen;
