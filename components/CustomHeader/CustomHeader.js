import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import colors from '../../data/colors';
import { POLLING_INTERVAL } from '../../data/constants';
import { getBackendActor } from '../../lib/actor';
import { useInterval } from '../../utility/utils';

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

  return otherUserProfile ? (
    <Text style={styles.headerUsername}>{otherUserProfile["username"]}</Text>
  ) : (
    <ActivityIndicator />
  );
};

const styles = StyleSheet.create({
  headerUsername: {
    fontSize: 24,
    fontFamily: "Poppins-Medium",
    color: colors.WHITE
  },
})

export default CustomHeader
