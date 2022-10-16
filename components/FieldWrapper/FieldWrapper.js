import { StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import { scale } from "../../utility/scalingUtils";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";

const FieldWrapper = ({ label, data, color }) => {
  const [showCopied, setShowCopied] = useState(false);

  const onPress = () => {
    Clipboard.setString(data);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1000);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>{label}</Text>
      {showCopied ? (
        <>
          <View style={styles.copy}>
            <Text style={styles.copyText}>Copied!</Text>
          </View>
          <View style={styles.copyTriangle} />
        </>
      ) : (
        <></>
      )}
      <View style={styles.container(color)}>
        <View style={styles.nestedContainer}>
          <Text numberOfLines={1} style={styles.data}>
            {data}
          </Text>
          <TouchableOpacity onPress={onPress}>
            <Icon
              name="clipboard"
              size={20}
              color={colors.WHITE}
              style={{ padding: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: scale(270),
    marginVertical: scale(25),
  },
  heading: {
    color: colors.WHITE,
    fontSize: scale(18),
    fontFamily: "Poppins-SemiBold",
    marginLeft: 10,
  },
  copy: {
    position: "absolute",
    backgroundColor: colors.BLUE,
    width: scale(35),
    height: scale(15),
    borderRadius: 4,
    right: scale(15),
    top: scale(25),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  copyText: {
    color: colors.WHITE,
    fontSize: scale(6),
    fontFamily: "Poppins-Medium",
    zIndex: 0,
  },
  copyTriangle: {
    borderTopWidth: scale(8),
    borderRightWidth: scale(8),
    borderBottomWidth: 0,
    borderLeftWidth: scale(8),
    borderTopColor: colors.BLUE,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
    right: scale(24.5),
    top: scale(38),
  },
  container: (color) => ({
    borderWidth: 1.7,
    marginTop: scale(10),
    height: 59,
    width: scale(270),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: color,
  }),
  nestedContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: scale(240),
  },
  data: {
    color: colors.WHITE,
    fontSize: scale(12),
    width: scale(200),
    fontFamily: "Poppins-SemiBold",
  },
});

export default FieldWrapper;
