import { Image, Platform, StyleSheet, View } from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../data/colors";

const TabBarIcon = ({ focused, image }) => {
  return (
    <View style={Platform.OS === "ios" ? styles.container : null}>
      <TouchableOpacity style={styles.touchableContainer(focused)}>
        <Image
          source={image}
          resizeMode="contain"
          style={styles.icon(focused)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 5,
  },
  touchableContainer: (focused) => ({
    backgroundColor: focused ? colors.DARK_PURPLE : "clear",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 55,
  }),
  icon: (focused) => ({
    tintColor: focused ? "white" : colors.GRAY,
    width: 25,
    height: 25,
  }),
});

export default TabBarIcon;
