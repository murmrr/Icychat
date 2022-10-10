import React, { useEffect, useState } from "react";
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
import { getBackendActor } from "../../lib/actor";
import { scale, verticalScale } from "../../utility/scalingUtils";
import { useInterval } from "../../utility/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomProfilePicture from "../../components/CustomProfilePicture/CustomProfilePicture";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import { clearAllCaches } from "../../utility/caches";

const MeScreen = ({ setIsSignedIn }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  useInterval(async () => {
    const response = await (await getBackendActor()).getMyProfile();
    setProfile(response["ok"]);
  }, POLLING_INTERVAL);

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
          <Text style={styles.usernameInput}>{profile["username"]}</Text>
          <Text style={styles.principalInput}>
            {profile["userPrincipal"].toText()}
          </Text>
        </View>
        {
          /*
          <TouchableOpacity onPress={() => {setEditing(!editing)}} style={styles.editButton}>
            <Text style={styles.editButtonText}>{editing ? "Done" : "Edit Profile"}</Text>
          </TouchableOpacity>
          */
        }
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
  usernameInput: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginTop: verticalScale(6),
  },
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
