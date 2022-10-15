import { StyleSheet, Text, View } from "react-native";
import colors from "../../data/colors";
import { scale } from "../../utility/scalingUtils";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from "expo-clipboard";

const FieldWrapper = ({ label, data, color }) => {
  const onPress = () => {
    Clipboard.setString(data);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>{label}</Text>
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
