import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";
import RNPhotoManipulator from "react-native-photo-manipulator";
import { getFromCache, PROFILE_CACHE } from "../../utility/caches";
import MultipleProfilePictureBackground from "../../assets/multiple-profile-picture-background.png";

const ProfilePictureStackMultiple = ({ principals, style }) => {
  const [uri, setUri] = useState(null);

  useEffect(async () => {
    let temp = getFromCache(PROFILE_CACHE, principals);
    if (temp) {
      setUri(temp);
    } else {
      const image = MultipleProfilePictureBackground;
      const texts = [
          { position: { x: 256, y: -64 }, text: String(principals.length), textSize: 1024, color: "#FFFFFF", fontName: "Arial" },
      ];
      
      const uri = await RNPhotoManipulator.printText(image, texts);
      setUri(uri);
    }
  }, [])

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
})

const ProfilePictureStack = ({ principals, style }) => {
  return principals.length == 1 ? (
    <CustomProfilePicture principal={principals[0]} style={style} />
  ) : (
    <ProfilePictureStackMultiple principals={principals} style={style} />
  );
};

export default ProfilePictureStack;
