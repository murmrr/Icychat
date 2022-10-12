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
      rsaBits: 4096,
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

cyrb128 = (str) => {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
};

sfc32 = (a, b, c, d) => {
  a >>>= 0;
  b >>>= 0;
  c >>>= 0;
  d >>>= 0;
  var t = (a + b) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  d = (d + 1) | 0;
  t = (t + d) | 0;
  c = (c + t) | 0;
  return t >>> 0;
};

export const randomFromPrincipal = (principal) => {
  const seed = cyrb128(principal.toString());
  return sfc32(seed[0], seed[1], seed[2], seed[3]);
};
