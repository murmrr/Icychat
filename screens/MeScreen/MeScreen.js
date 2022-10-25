import { Ed25519KeyIdentity } from "@dfinity/identity";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import CustomProfilePicture from "../../components/CustomProfilePicture/CustomProfilePicture";
import DepositDetailsModal from "../../components/DepositDetailsModal/DepositDetailsModal";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { makeBackendActor, makeLedgerActor } from "../../lib/actor";
import { MainContext } from "../../navigation/MainNavigation/MainNavigation";
import {
  addToCache,
  clearAllCaches,
  GENERAL_CACHE,
  getFromCache,
  PROFILE_CACHE,
} from "../../utility/caches";
import { scale, verticalScale } from "../../utility/scalingUtils";
import {
  computeAccountId,
  formatE8s,
  parseProfile,
  stringifyProfile,
  useInterval,
} from "../../utility/utils";

const MeScreen = ({ navigation, setIsSignedIn }) => {
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState(-1n);

  const context = useContext(MainContext);

  useEffect(() => {
    let value = getFromCache(GENERAL_CACHE, "@balance");
    if (value) {
      setAmount(BigInt(value));
    }
  }, []);

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
    const accountBalanceArgs = {
      account: [
        ...new Uint8Array(
          Buffer.from(
            computeAccountId(
              Ed25519KeyIdentity.fromJSON(
                JSON.stringify(context)
              ).getPrincipal()
            ),
            "hex"
          )
        ),
      ],
    };
    const response = await makeLedgerActor(context).account_balance(
      accountBalanceArgs
    );
    const numE8s = response["e8s"];
    setAmount(numE8s);
    addToCache(GENERAL_CACHE, "@balance", numE8s.toString());
  }, POLLING_INTERVAL);

  useInterval(async () => {
    let temp = getFromCache(PROFILE_CACHE, context);
    if (temp) {
      setProfile(parseProfile(temp));
    } else {
      const response = await makeBackendActor(context).getMyProfile();
      setProfile(response["ok"]);
      addToCache(PROFILE_CACHE, context, stringifyProfile(response["ok"]));
    }
  }, POLLING_INTERVAL);

  const handleGhost = async () => {
    Alert.alert(
      "Ghost Account",
      "Are you sure you want to ghost your account?",
      [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              clearAllCaches();
              setIsSignedIn(false);
            } catch (exception) {}
          },
        },
      ]
    );
  };

  const handleBurn = async () => {
    Alert.alert("Burn Account", "Are you sure you want to burn your account?", [
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
    ]);
  };

  return profile ? (
    <>
      <DepositDetailsModal
        principal={profile["userPrincipal"]}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
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
                {profile["userPrincipal"].toText()}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon
                  name="piggy-bank"
                  size={19}
                  color={colors.WHITE}
                  style={{ padding: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            <Image
              source={require("../../assets/icp-token-logo.png")}
              style={styles.icpLogo}
            />
            <View style={styles.amountContainer}>
              {amount != -1n ? (
                <Text style={styles.amount}>{formatE8s(amount)}</Text>
              ) : (
                <CustomActivityIndicator />
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleGhost}
          style={[
            styles.button,
            {
              marginBottom: verticalScale(-25),
              backgroundColor: colors.YELLOW,
            },
          ]}
        >
          <Text style={styles.buttonText}>Ghost</Text>
          <Icon name="ghost" size={14} color={colors.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBurn} style={styles.button}>
          <Text style={styles.buttonText}>Burn</Text>
          <Icon name="fire" size={14} color={colors.WHITE} />
        </TouchableOpacity>
      </ScrollView>
    </>
  ) : (
    <View style={styles.loadingContainer}>
      <CustomActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  modalTileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    justifyContent: "space-evenly",
    width: scale(320),
    alignItems: "center",
  },
  principal: {
    textAlign: "center",
    color: colors.GRAY,
    fontSize: 8,
    fontFamily: "Poppins-Regular",
  },
  balanceContainer: {
    marginTop: verticalScale(-25),
    width: scale(180),
    height: scale(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icpLogo: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(35),
    backgroundColor: colors.LIGHT_GRAY,
  },
  amountContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scale(10),
  },
  amount: {
    textAlign: "center",
    color: colors.WHITE,
    fontSize: scale(22),
    fontFamily: "Poppins-SemiBold",
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
