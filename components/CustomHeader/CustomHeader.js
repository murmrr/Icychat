import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import ProfilePictureStack from "../ProfilePictureStack/ProfilePictureStack";

const CustomHeader = ({ principals }) => {
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getProfile(principals[0]);
    if (response["ok"]) {
      setOtherUserProfile(response["ok"]);
    } else if (response["#err"]) {
      setOtherUserProfile(null);
    }
  }, POLLING_INTERVAL);

  return <ProfilePictureStack principals={principals} style={styles.avatar} />;
};

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  headerUsername: {
    fontSize: 24,
    fontFamily: "Poppins-Medium",
    color: colors.WHITE,
  },
});

export default CustomHeader;
