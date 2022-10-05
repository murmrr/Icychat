import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import colors from '../../data/colors';
import { POLLING_INTERVAL } from '../../data/constants';
import { getBackendActor } from '../../lib/actor';
import { useInterval } from '../../utility/utils';
import CustomProfilePicture from '../CustomProfilePicture/CustomProfilePicture';

const CustomHeader = ({ principal }) => {
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getProfile(principal);
    if (response["ok"]) {
      setOtherUserProfile(response["ok"]);
    } else if (response["#err"]) {
      setOtherUserProfile(null);
    }
  }, POLLING_INTERVAL);

  /*
  return otherUserProfile ? (
    <Text style={styles.headerUsername}>{otherUserProfile["username"]}</Text>
  ) : (
    <ActivityIndicator />
  );
  */
 return (
  <CustomProfilePicture principal={principal} style={styles.avatar}/>
 );
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
    color: colors.WHITE
  },
})

export default CustomHeader
