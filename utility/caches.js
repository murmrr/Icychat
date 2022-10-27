import { MMKV } from "react-native-mmkv";

export const GENERAL_CACHE = new MMKV({
  id: "generalCache",
});

export const PROFILE_PICTURE_CACHE = new MMKV({
  id: "profilePictureCache",
});

export const PROFILE_CACHE = new MMKV({
  id: "profileCache",
});

export const MESSAGE_CACHE = new MMKV({
  id: "messageCache",
});

export const CONVERSATION_CACHE = new MMKV({
  id: "conversationCache",
});

export const isInCache = (cacheType, key) => {
  return cacheType.contains(key.toString());
};

export const getFromCache = (cacheType, key) => {
  return cacheType.getString(key.toString());
};

export const addToCache = (cacheType, key, value) => {
  cacheType.set(key.toString(), value);
};

export const clearAllCaches = () => {
  GENERAL_CACHE.clearAll();
  PROFILE_PICTURE_CACHE.clearAll();
  PROFILE_CACHE.clearAll();
  MESSAGE_CACHE.clearAll();
  CONVERSATION_CACHE.clearAll();
};
