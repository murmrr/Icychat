import React from "react";
import { View } from "react-native";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const ProfilePictureStackMultiple = ({ principals, style }) => {
  return <CustomProfilePicture principal={principals[0]} style={style} />;
};

const ProfilePictureStack = ({ principals, style }) => {
  return principals.length == 1 ? (
    <CustomProfilePicture principal={principals[0]} style={style} />
  ) : (
    <ProfilePictureStackMultiple principals={principals} style={style} />
  );
};

export default ProfilePictureStack;
