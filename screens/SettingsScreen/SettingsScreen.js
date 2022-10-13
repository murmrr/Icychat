import React, { useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import CustomBackButton from "../../components/CustomBackButton/CustomBackButton";
import colors from "../../data/colors";

const SettingsScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => <CustomBackButton navigation={navigation} />,
      headerStyle: {
        backgroundColor: colors.BLUE,
      },
    });
  }, []);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.DARK_PRIMARY,
  },
});

export default SettingsScreen;
