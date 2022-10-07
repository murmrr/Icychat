import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import colors from "../../data/colors";

const FindSearchBar = ({
  query,
  setQuery,
  searchBarLoading,
  setSearchBarLoading,
}) => {
  const onChangeText = (text) => {
    setQuery(text);
    setSearchBarLoading(true);
  };

  return (
    <SearchBar
      lightTheme={false}
      placeholder="Search"
      onChangeText={onChangeText}
      value={query}
      containerStyle={styles.containerStyle}
      inputContainerStyle={styles.inputContainerStyle}
      showLoading={searchBarLoading}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.DARK_PRIMARY,
  },
  inputContainerStyle: {
    borderRadius: 15,
    height: 40,
  },
});

export default FindSearchBar;
