import { StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import { scale, verticalScale } from "../../utility/scalingUtils";

const InputWrapper = ({ label, color, children, style }) => {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.labelContainer(color)}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.inputContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderWidth: 1.7,
    marginTop: verticalScale(28),
    height: 59,
    width: scale(304),
    alignSelf: "center",
    borderRadius: 10,
    borderColor: colors.GRAY,
  },
  labelContainer: (color) => ({
    position: "absolute",
    top: -13,
    left: 20,
    width: "auto",
    borderRadius: 8,
    backgroundColor: color ? color : colors.DARK_PRIMARY,
  }),
  labelText: {
    color: colors.GRAY,
    alignSelf: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginHorizontal: 5,
  },
  inputContainer: { flex: 1, alignItems: "center", flexDirection: "row" },
});

export default InputWrapper;
