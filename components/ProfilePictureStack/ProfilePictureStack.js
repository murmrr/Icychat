import React from "react";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const ProfilePictureStack = ({ principals, style }) => {
  return <CustomProfilePicture principal={principals[0]} style={style} />;
};

export default ProfilePictureStack;
