import { useEffect, useRef } from "react";
import moment from "moment";
import { NativeModules, Platform } from "react-native";
import Aes from "react-native-aes-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OpenPGP from "react-native-fast-openpgp";
import { Principal } from "@dfinity/principal";
import { GENERAL_CACHE, getFromCache, storage } from "./caches";
import CryptoJS from "crypto-js";
import crc32 from "buffer-crc32";

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
  const privateKey = getFromCache(GENERAL_CACHE, "@privateKey");
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

export const stringifyProfile = (input) => {
  const stringified = JSON.stringify(input, (key, value) => {
    return key == "userPrincipal" ? value.toText() : value;
  });
  return stringified;
};

export const parseProfile = (input) => {
  const parsed = JSON.parse(input, (key, value) => {
    return key == "userPrincipal" ? Principal.fromText(value) : value;
  });
  return parsed;
};

export const stringifyChatHeaders = (input) => {
  const stringified = JSON.stringify(input, (key, value) => {
    if (key == "otherUsers") {
      let newValue = [];
      value.forEach((p) => {
        newValue.push(p.toText());
      });
      return newValue;
    } else if (key == "id" || key == "time") {
      return value.toString();
    } else {
      return value;
    }
  });
  return stringified;
};

export const parseChatHeaders = (input) => {
  const parsed = JSON.parse(input, (key, value) => {
    if (key == "otherUsers") {
      let newValue = [];
      value.forEach((p) => {
        newValue.push(Principal.fromText(p));
      });
      return newValue;
    } else if (key == "id" || key == "time") {
      return BigInt(value);
    } else {
      return value;
    }
  });
  return parsed;
};

export const stringifyConversation = (input) => {
  const stringified = JSON.stringify(input, (key, value) => {
    if (key == "sender") {
      return value.toText();
    } else if (key == "id" || key == "time") {
      return value.toString();
    } else {
      return value;
    }
  });
  return stringified;
};

export const parseConversation = (input) => {
  const parsed = JSON.parse(input, (key, value) => {
    if (key == "sender") {
      return Principal.fromText(value);
    } else if (key == "id" || key == "time") {
      return BigInt(value);
    } else {
      return value;
    }
  });
  return parsed;
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

const byteArrayToWordArray = (byteArray, cryptoAdapter = CryptoJS) => {
  const wordArray = [];
  let i;
  for (i = 0; i < byteArray.length; i += 1) {
    wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i);
  }
  // eslint-disable-next-line
  const result = cryptoAdapter.lib.WordArray.create(
    wordArray,
    byteArray.length
  );
  return result;
};

const wordToByteArray = (word, length) => {
  const byteArray = [];
  const xFF = 0xff;
  if (length > 0) byteArray.push(word >>> 24);
  if (length > 1) byteArray.push((word >>> 16) & xFF);
  if (length > 2) byteArray.push((word >>> 8) & xFF);
  if (length > 3) byteArray.push(word & xFF);

  return byteArray;
};

const wordArrayToByteArray = (wordArray, length) => {
  if (
    wordArray.hasOwnProperty("sigBytes") &&
    wordArray.hasOwnProperty("words")
  ) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  let result = [];
  let bytes;
  let i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result = [...result, bytes];
    i++;
  }
  return [].concat.apply([], result);
};

const intToHex = (val) => {
  return val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);
};

const generateChecksum = (hash) => {
  const crc = crc32.unsigned(Buffer.from(hash));
  const hex = intToHex(crc);
  return hex.padStart(8, "0");
};

export const computeAccountId = (
  principal,
  subaccount,
  cryptoAdapter = CryptoJS
) => {
  const sha = cryptoAdapter.algo.SHA224.create();
  sha.update("\x0Aaccount-id"); // Internally parsed with UTF-8, like go does
  sha.update(byteArrayToWordArray(principal.toUint8Array()));
  const subBuffer = Buffer.from(Buffer.alloc(32));
  if (subaccount) {
    subBuffer.writeUInt32BE(subaccount);
  }
  sha.update(byteArrayToWordArray(subBuffer));
  const hash = sha.finalize();

  /// While this is backed by an array of length 28, it's canonical representation
  /// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
  /// hash of the following 56 characters of hex. Both, upper and lower case
  /// characters are valid in the input string and can even be mixed.
  /// [ic/rs/rosetta-api/ledger_canister/src/account_identifier.rs]
  const byteArray = wordArrayToByteArray(hash, 28);
  const checksum = generateChecksum(byteArray);
  const val = checksum + hash.toString();

  return val;
};
