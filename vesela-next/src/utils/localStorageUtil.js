// /utils/storage.js

const isBrowser = typeof window !== "undefined";

export const localStorageUtil = {
  set(key, value) {
    if (!isBrowser || !key) return false;

    try {
      const data =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, data);
      return true;
    } catch (err) {
      console.error("Storage SET error:", err);
      return false;
    }
  },

  get(key, defaultValue = null) {
    if (!isBrowser || !key) return defaultValue;

    try {
      const item = localStorage.getItem(key);

      if (item === null || item === undefined) return defaultValue;

      // Try parsing JSON, fallback to raw string
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (err) {
      console.error("Storage GET error:", err);
      return defaultValue;
    }
  },

  remove(key) {
    if (!isBrowser || !key) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error("Storage REMOVE error:", err);
      return false;
    }
  },

  clear() {
    if (!isBrowser) return false;

    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.error("Storage CLEAR error:", err);
      return false;
    }
  },
};