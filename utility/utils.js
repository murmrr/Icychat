import { useEffect, useRef } from "react";
import moment from "moment";
import { NativeModules, Platform } from "react-native";
import Aes from "react-native-aes-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OpenPGP from "react-native-fast-openpgp";
var lz = require("lz-string");

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const convertTime = (bigTime) => {
  const utc = Number(bigTime) / 1000000;
  if (utc) {
    return moment(utc).format("h:mm a");
  }
  return utc;
};

export const generateAsymmetricKeys = async () => {
  return await OpenPGP.generate({
    keyOptions: {
      rsaBits: 6144,
    },
  });
};

export const getMyPublicKey = async () => {
  const privateKey = await AsyncStorage.getItem("@privateKey");
  return await OpenPGP.convertPrivateKeyToPublicKey(privateKey);
};

export const encryptAsymmetric = async (input, key) => {
  return await OpenPGP.encrypt(input, key);
};

export const decryptAsymmetric = async (input, key) => {
  return await OpenPGP.decrypt(input, key, "");
};

export const generateSymmetricKey = async () => {
  const t = new Date();

  return await Aes.pbkdf2("", t.toISOString(), 1024, 256);
};

export const encryptSymmetric = async (input, key) => {
  const iv = await Aes.randomKey(256);

  const cipherText = await Aes.encrypt(input, key, iv, "aes-256-cbc");
  const output = {
    iv: iv,
    cipherText: cipherText,
  };
  return JSON.stringify(output);
};

export const decryptSymmetric = async (input, key) => {
  const parsed = JSON.parse(input);

  const decrypted = await Aes.decrypt(
    parsed.cipherText,
    key,
    parsed.iv,
    "aes-256-cbc"
  );

  return decrypted;
};
