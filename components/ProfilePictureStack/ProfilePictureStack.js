import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import RNPhotoManipulator from "react-native-photo-manipulator";
import rnTextSize from "react-native-text-size";
import MultipleProfilePictureBackground from "../../assets/multiple-profile-picture-background.png";
import colors from "../../data/colors";
import { scale } from "../../utility/scalingUtils";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const ProfilePictureStackMultiple = ({ principals, width, height, style }) => {
  const [uri, setUri] = useState(null);

  useEffect(async () => {
    const _text =
      principals.length - 3 < 10 ? "+" + String(principals.length - 3) : "+...";
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
  }, [principals]);

  if (principals.length == 2) {
    return (
      <View style={style}>
        <CustomProfilePicture
          principal={principals[0]}
          style={{
            aspectRatio: 1,
            height: height / 2,
            borderRadius: height,
            position: "absolute",
            top: 0.14644 * (height / 4),
            left: 0.14644 * (height / 4),
          }}
        />
        <CustomProfilePicture
          principal={principals[1]}
          style={{
            aspectRatio: 1,
            height: height / 2,
            borderRadius: height,
            position: "absolute",
            bottom: 0.14644 * (height / 4),
            right: 0.14644 * (height / 4),
          }}
        />
      </View>
    );
  }

  const backR = width / 4.31654676262;
  const frontR = width / 10;
  const radius = width / 8;
  if (principals.length == 3) {
    return (
      <View style={style}>
        {[...principals.values()].map((principal, index) => {
          const angle = index * ((2 * Math.PI) / principals.length);
          return (
            <CustomProfilePicture
              principal={principal}
              style={{
                aspectRatio: 1,
                height: height * 0.46333333333,
                borderRadius: height,
                position: "absolute",
                left: backR - frontR + radius * Math.cos(angle),
                top: backR - frontR + radius * Math.sin(angle),
              }}
            />
          );
        })}
      </View>
    );
  }

  if (principals.length > 3) {
    return (
      <View style={style}>
        {[...principals.values()].slice(0, 3).map((principal, index) => {
          const angle = index * ((2 * Math.PI) / 4);
          return (
            <CustomProfilePicture
              principal={principal}
              style={{
                aspectRatio: 1,
                height: height * 0.46333333333,
                borderRadius: height,
                position: "absolute",
                left: backR - frontR + radius * Math.cos(angle),
                top: backR - frontR + radius * Math.sin(angle),
              }}
            />
          );
        })}
        <Image
          source={{ uri: uri }}
          style={{
            borderWidth: 1.5,
            borderColor: colors.WHITE,
            aspectRatio: 1,
            height: height * 0.46333333333,
            borderRadius: height,
            position: "absolute",
            left:
              (height * 0.46333333333) / 4 +
              backR -
              frontR +
              radius * Math.cos(4.71238898038),
            top: backR - frontR + radius * Math.sin(4.71238898038),
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
});

const ProfilePictureStack = ({ principals, width, height, style }) => {
  return principals.length == 1 ? (
    <CustomProfilePicture principal={principals[0]} style={style} />
  ) : (
    <ProfilePictureStackMultiple
      principals={principals}
      width={width}
      height={height}
      style={style}
    />
  );
};

export default ProfilePictureStack;
