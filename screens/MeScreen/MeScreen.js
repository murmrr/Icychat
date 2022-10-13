import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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
import {
  computeAccountId,
  parseProfile,
  stringifyProfile,
  useInterval,
} from "../../utility/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomProfilePicture from "../../components/CustomProfilePicture/CustomProfilePicture";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import {
  addToCache,
  clearAllCaches,
  getFromCache,
  PROFILE_CACHE,
  storage,
} from "../../utility/caches";
import Toast from "react-native-root-toast";
import * as Haptics from "expo-haptics";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import { Ed25519KeyIdentity, Ed25519PublicKey } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";

const MeScreen = ({ navigation, setIsSignedIn }) => {
  const [profile, setProfile] = useState(null);
  const [showPrincipal, setShowPrincipal] = useState(true);

  const context = useContext(MainContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("InfoNavigation")}
          style={{
            paddingHorizontal: 20,
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon name="info-circle" size={20} color={colors.WHITE} />
        </TouchableOpacity>
      ),
    });
  }, []);

  useInterval(async () => {
    let temp = getFromCache(PROFILE_CACHE, context);
    if (temp) {
      setProfile(parseProfile(temp));
    } else {
      const response = await makeBackendActor(context).getMyProfile();
      setProfile(response["ok"]);
      addToCache(PROFILE_CACHE, context, stringifyProfile(response["ok"]));
    }
    //console.log(profile["userPrincipal"].toText())
    //console.log(computeAccountId(profile["userPrincipal"]))
    //console.log(computeAccountId(Principal.fromText("m37qu-j2p6l-dz64a-gpusl-xoskc-zdtpy-hn3vr-iakwg-anjr7-ih4qv-nqe")))
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
              await makeBackendActor(context).burnAccount();
              clearAllCaches();
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
          <Text style={styles.username}>{profile["username"]}</Text>
          <View style={styles.principalContainer}>
          <Text style={styles.principal}>
            {showPrincipal ? profile["userPrincipal"].toText() : computeAccountId(profile["userPrincipal"])}
          </Text>
          <TouchableOpacity onPress={() => setShowPrincipal(!showPrincipal)}>
          <Icon name={showPrincipal ? "send" : "bank"} size={18} color={colors.WHITE} style={{padding: 10}}/>
          </TouchableOpacity>
          </View>
        </View>
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
  username: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginTop: verticalScale(6),
    borderRadius: 15,
    width: scale(225),
    alignSelf: "center",
  },
  principalContainer: {
    flexDirection: "row",
    //borderWidth: 1,
    justifyContent: "space-between",
    width: scale(300),
    alignItems: "center",
    //marginTop: verticalScale(6),
  },
  principal: {
    textAlign: "center",
    color: colors.GRAY,
    fontSize: 8,
    fontFamily: "Poppins-Regular",
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
