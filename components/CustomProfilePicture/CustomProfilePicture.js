import React from "react";
import { Image, StyleSheet, View } from "react-native";
import image0 from "../../assets/0.png";
import image1 from "../../assets/1.png";
import image2 from "../../assets/2.png";
import image3 from "../../assets/3.png";

const CustomProfilePicture = ({ principal, style }) => {
  const sources = [image0, image1, image2, image3];

  return (
    <View style={style}>
      <Image
        source={sources[principal["_arr"][0] % 4]}
        style={[style, styles.image]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
});

export default CustomProfilePicture;
