import { StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import { scale } from "../../utility/scalingUtils";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";

const InputWrapper = ({ label, data, color }) => {
  return (
    <View style={styles.root}>
      <Text style={styles.heading}>{label}</Text>
      <View style={styles.container(color)}>
        <View style={styles.nestedContainer}>
          <Text numberOfLines={1} style={styles.data}>{data}</Text>
          <TouchableOpacity>
            <Icon name="clipboard" size={20} color={colors.WHITE} />
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
  container: (color) => ({
    borderWidth: 1.7,
    marginTop: scale(10),
    height: 59,
    width: scale(270),
    alignSelf: "center",
    alignItems: "center", justifyContent: "center",
    borderRadius: 10,
    borderColor: color,
  }),
  nestedContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: scale(220),
  },
  data: {
    color: colors.WHITE,
    fontSize: scale(12),
    width: scale(180),
    fontFamily: "Poppins-SemiBold",
  }
});

export default InputWrapper;
