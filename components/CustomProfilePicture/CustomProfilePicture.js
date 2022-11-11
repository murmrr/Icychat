import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import Coral from "../../assets/trait-layers/background/Coral.png";
import Gold from "../../assets/trait-layers/background/Gold.png";
import IceBlue from "../../assets/trait-layers/background/Ice-Blue.png";
import NeonGreen from "../../assets/trait-layers/background/Neon-Green.png";
import Orange from "../../assets/trait-layers/background/Orange.png";
import Purple from "../../assets/trait-layers/background/Purple.png";
import Titanium from "../../assets/trait-layers/background/Titanium.png";

import Golden from "../../assets/trait-layers/species/Golden.png";
import Roborovski from "../../assets/trait-layers/species/Roborovski.png";
import TeddyBear from "../../assets/trait-layers/species/Teddy-Bear.png";
import WinterWhite from "../../assets/trait-layers/species/Winter-White.png";

import Angel from "../../assets/trait-layers/outfit/Angel.png";
import Bathrobe from "../../assets/trait-layers/outfit/Bathrobe.png";
import Burglar from "../../assets/trait-layers/outfit/Burglar.png";
import CamoHoodie from "../../assets/trait-layers/outfit/Camo-Hoodie.png";
import ClownSuit from "../../assets/trait-layers/outfit/Clown-Suit.png";
import ConstructionVest from "../../assets/trait-layers/outfit/Construction-Vest.png";
import Cop from "../../assets/trait-layers/outfit/Cop.png";
import Doctor from "../../assets/trait-layers/outfit/Doctor.png";
import FurCoat from "../../assets/trait-layers/outfit/Fur-Coat.png";
import HawaiianShirt from "../../assets/trait-layers/outfit/Hawaiian-Shirt.png";
import JeanJacket from "../../assets/trait-layers/outfit/Jean-Jacket.png";
import Poncho from "../../assets/trait-layers/outfit/Poncho.png";
import PrisonJumpsuit from "../../assets/trait-layers/outfit/Prison-Jumpsuit.png";
import Suit from "../../assets/trait-layers/outfit/Suit.png";
import TurtleNeck from "../../assets/trait-layers/outfit/Turtle-Neck.png";
import WifeBeater from "../../assets/trait-layers/outfit/Wife-Beater.png";

import Bitcoin from "../../assets/trait-layers/eyes/Bitcoin.png";
import Bloodshot from "../../assets/trait-layers/eyes/Bloodshot.png";
import BlueHappy from "../../assets/trait-layers/eyes/Blue-Happy.png";
import BlueSurprised from "../../assets/trait-layers/eyes/Blue-Surprised.png";
import BrownHappy from "../../assets/trait-layers/eyes/Brown-Happy.png";
import Crossed from "../../assets/trait-layers/eyes/Crossed.png";
import GoldSurprised from "../../assets/trait-layers/eyes/Gold-Surprised.png";
import GreenHappy from "../../assets/trait-layers/eyes/Green-Happy.png";
import Laser from "../../assets/trait-layers/eyes/Laser.png";
import Money from "../../assets/trait-layers/eyes/Money.png";
import Sad from "../../assets/trait-layers/eyes/Sad.png";

import Bubblegum from "../../assets/trait-layers/miscellaneous/Bubblegum.png";
import Cigar from "../../assets/trait-layers/miscellaneous/Cigar.png";
import DevilOnShoulder from "../../assets/trait-layers/miscellaneous/Devil-On-Shoulder.png";
import GoldChain from "../../assets/trait-layers/miscellaneous/Gold-Chain.png";
import Joint from "../../assets/trait-layers/miscellaneous/Joint.png";
import None from "../../assets/trait-layers/miscellaneous/None.png";
import SnakeOnShoulder from "../../assets/trait-layers/miscellaneous/Snake-On-Shoulder.png";

import RNPhotoManipulator from "react-native-photo-manipulator";
import {
  addToCache,
  getFromCache,
  PROFILE_PICTURE_CACHE,
} from "../../utility/caches";
import { randomFromPrincipal } from "../../utility/utils";
import colors from "../../data/colors";

const CustomProfilePicture = ({ principal, style }) => {
  const [uri, setUri] = useState(null);

  const backgrounds = [
    Coral,
    Gold,
    IceBlue,
    NeonGreen,
    Orange,
    Purple,
    Titanium,
  ];
  const species = [Golden, Roborovski, TeddyBear, WinterWhite];
  const outfits = [
    Angel,
    Bathrobe,
    Burglar,
    CamoHoodie,
    ClownSuit,
    ConstructionVest,
    Cop,
    Doctor,
    FurCoat,
    HawaiianShirt,
    JeanJacket,
    Poncho,
    PrisonJumpsuit,
    Suit,
    TurtleNeck,
    WifeBeater,
  ];
  const eyes = [
    Bitcoin,
    Bloodshot,
    BlueHappy,
    BlueSurprised,
    BrownHappy,
    Crossed,
    GoldSurprised,
    GreenHappy,
    Laser,
    Money,
    Sad,
  ];
  const miscellaneous = [
    Bubblegum,
    Cigar,
    DevilOnShoulder,
    GoldChain,
    Joint,
    None,
    SnakeOnShoulder,
  ];

  useEffect(async () => {
    const rand = randomFromPrincipal(principal);
    let temp = getFromCache(PROFILE_PICTURE_CACHE, rand);
    if (temp) {
      setUri(temp);
    } else {
      const operations = [
        {
          operation: "overlay",
          overlay: species[rand % species.length],
          position: { x: 0, y: 0 },
        },
        {
          operation: "overlay",
          overlay: outfits[rand % outfits.length],
          position: { x: 0, y: 0 },
        },
        {
          operation: "overlay",
          overlay: eyes[rand % eyes.length],
          position: { x: 0, y: 0 },
        },
        {
          operation: "overlay",
          overlay: miscellaneous[rand % miscellaneous.length],
          position: { x: 0, y: 0 },
        },
      ];
      const uri = await RNPhotoManipulator.batch(
        backgrounds[rand % backgrounds.length],
        operations,
        { x: 0, y: 0, height: 2500, width: 2000 },
        null,
        1
      );
      setUri(uri);
      addToCache(PROFILE_PICTURE_CACHE, rand, uri);
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
    borderWidth: 1.5,
    borderColor: colors.WHITE,
  },
});

export default CustomProfilePicture;
