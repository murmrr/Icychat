import { StyleSheet, View } from "react-native";

import colors from "../../data/colors";

const ItemDivider = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.GRAY,
    height: StyleSheet.hairlineWidth,
    width: "94%",
    alignSelf: "center",
  },
});

export default ItemDivider;
