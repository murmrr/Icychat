import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cache } from "react-native-cache";

export const PROFILE_CACHE = new Cache({
  namespace: "profileCache",
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: AsyncStorage,
});

export const MESSAGE_CACHE = new Cache({
  namespace: "messageCache",
  policy: {
    maxEntries: 50000,
    stdTTL: 60,
  },
  backend: AsyncStorage,
});

export const getFromCache = async (cacheType, key) => {
  return await cacheType.get(key);
};

export const addToCache = async (cacheType, key, value) => {
  await cacheType.set(key, value);
};

export const clearAllCaches = async () => {
  await PROFILE_CACHE.clearAll();
  await MESSAGE_CACHE.clearAll();
};
