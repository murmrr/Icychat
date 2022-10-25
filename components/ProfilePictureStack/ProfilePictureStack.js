import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import RNPhotoManipulator from "react-native-photo-manipulator";
import rnTextSize from "react-native-text-size";
import MultipleProfilePictureBackground from "../../assets/multiple-profile-picture-background.png";
import { getFromCache, PROFILE_CACHE } from "../../utility/caches";
import { scale } from "../../utility/scalingUtils";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const ProfilePictureStackMultiple = ({ principals, style }) => {
  const [uri, setUri] = useState(null);

  useEffect(async () => {
    const _text = String(principals.length);
    const _textSize = scale(300);

    const fontSpecs = {
      fontFamily: "Arial",
      fontSize: _textSize,
    };

    const size = await rnTextSize.measure({
      text: _text,
      width: 1024,
      ...fontSpecs,
    });

    let temp = getFromCache(PROFILE_CACHE, principals);
    if (temp) {
      setUri(temp);
    } else {
      const image = MultipleProfilePictureBackground;
      const texts = [
        {
          position: { x: 512 - size["width"] / 2, y: 512 - size["height"] / 2 },
          text: _text,
          textSize: _textSize,
          color: "#FFFFFF",
          fontName: "Arial",
        },
      ];

      const uri = await RNPhotoManipulator.printText(image, texts);
      setUri(uri);
    }
  }, []);

  return (
    <View style={style}>
      <Image source={{ uri: uri }} style={[style, styles.image]} />
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

const ProfilePictureStack = ({ principals, style }) => {
  return principals.length == 1 ? (
    <CustomProfilePicture principal={principals[0]} style={style} />
  ) : (
    <ProfilePictureStackMultiple principals={principals} style={style} />
  );
};

export default ProfilePictureStack;
