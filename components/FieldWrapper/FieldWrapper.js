import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";
import BubbleToast from "../BubbleToast/BubbleToast";

const FieldWrapper = ({ label, data, color, top }) => {
  const [showCopied, setShowCopied] = useState(false);

  const onPress = () => {
    Clipboard.setString(data);
    setShowCopied(true);
  };

  return (
    <View style={styles.root(top)}>
      <Text style={styles.heading}>{label}</Text>
      <BubbleToast
        text={"Copied!"}
        fontSize={scale(6)}
        width={scale(30)}
        left={scale(222)}
        top={scale(30)}
        visible={showCopied}
        setVisible={setShowCopied}
      />
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
  root: (top) => ({
    width: scale(270),
    marginVertical: verticalScale(22),
    marginTop: top ? 0 : verticalScale(22),
  }),
  heading: {
    color: colors.WHITE,
    fontSize: scale(18),
    fontFamily: "Poppins-SemiBold",
    marginLeft: 10,
  },
  container: (color) => ({
    borderWidth: 1.7,
    marginTop: scale(10),
    height: verticalScale(52),
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
