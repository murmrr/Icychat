import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import FindBar from "../../components/FindBar/FindBar";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";

const FindScreen = () => {
  const [allUsers, setAllUsers] = useState(null);

  useInterval(async () => {
    const response = await (await getBackendActor()).getAllUsers();
    if (response["ok"]) {
      setAllUsers(response["ok"]);
    } else if (response["#err"]) {
      setAllUsers(null);
    }
  }, POLLING_INTERVAL);

  const renderItem = ({ item }) => <FindBar principal={item} />;

  const keyExtractor = (item) => item;

  return (
    <View style={styles.container}>
      {allUsers ? (
        <FlatList
          data={allUsers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: colors.DARK_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FindScreen;
