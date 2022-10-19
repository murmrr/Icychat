import React from "react";
import { View } from "react-native";
import CustomProfilePicture from "../CustomProfilePicture/CustomProfilePicture";

const ProfilePictureStackMultiple = ({ principals, style }) => {
  return (
    <>
      {[...principals.values()].map((principal, index) => {
        return (
          <CustomProfilePicture
            principal={principal}
            style={[
              style,
              { position: "absolute", opacity: 1 / principals.length },
            ]}
          />
        );
      })}
    </>
  );
};

const ProfilePictureStack = ({ principals, style }) => {
  return principals.length == 1 ? (
    <CustomProfilePicture principal={principals[0]} style={style} />
  ) : (
    <ProfilePictureStackMultiple principals={principals} style={style} />
  );
};

export default ProfilePictureStack;
