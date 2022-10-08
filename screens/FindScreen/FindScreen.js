import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AddToChatButton from "../../components/AddToChatButton/AddToChatButton";
import CustomActivityIndicator from "../../components/CustomActivityIndicator/CustomActivityIndicator";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import FindBar from "../../components/FindBar/FindBar";
import FindSearchBar from "../../components/FindSearchBar/FindSearchBar";
import ItemDivider from "../../components/ItemDivider/ItemDivider";
import colors from "../../data/colors";
import { POLLING_INTERVAL } from "../../data/constants";
import { getBackendActor } from "../../lib/actor";
import { useInterval } from "../../utility/utils";

const FindScreen = ({ forAdd, navigation, route }) => {
  const id = forAdd ? route.params.id : null;
  const chatKey = forAdd ? route.params.chatKey : null;

  const [allUsers, setAllUsers] = useState(null);
  const [query, setQuery] = useState("");
  const [searchBarLoading, setSearchBarLoading] = useState(false);

  useLayoutEffect(() => {
    if (forAdd) {
      navigation.setOptions({
        headerTitle: "Add",
        headerLeft: (props) => <CustomBackButton navigation={navigation} />,
        headerStyle: {
          backgroundColor: colors.BLUE,
        },
      });
    }
  }, []);

  useInterval(async () => {
    const response = await (await getBackendActor()).getUsers(query);
    if (response["ok"]) {
      setAllUsers(response["ok"]);
      if (searchBarLoading) {
        setSearchBarLoading(false);
      }
    } else if (response["#err"]) {
      setAllUsers(null);
    }
  }, POLLING_INTERVAL);

  const renderItem = ({ item }) => (
    <FindBar
      id={forAdd ? id : undefined}
      chatKey={forAdd ? chatKey : undefined}
      principal={item}
      forAdd={forAdd}
    />
  );

  const keyExtractor = (item) => item;

  return (
    <View style={styles.container(query == "")}>
      {allUsers ? (
        <FlatList
          ListHeaderComponent={
            <FindSearchBar
              query={query}
              setQuery={setQuery}
              searchBarLoading={searchBarLoading}
              setSearchBarLoading={setSearchBarLoading}
            />
          }
          data={query == "" ? [] : allUsers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemDivider}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <CustomActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: (isEmpty) => ({
    height: "100%",
    backgroundColor: colors.DARK_PRIMARY,
  }),
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FindScreen;
