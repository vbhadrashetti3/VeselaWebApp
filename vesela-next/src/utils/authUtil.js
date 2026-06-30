import { localStorageUtil } from "./localStorageUtil";

/**
 * Safely decodes a JWT token on the client side.
 * Returns the decoded JSON payload or null.
 */
export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn("Failed to decode JWT:", err);
    return null;
  }
}

/**
 * Reads a cookie by name from the browser.
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

/**
 * Resolves the token expiration time in milliseconds.
 * Checks the my-app-auth cookie first, falling back to localStorage.
 */
export function getAuthTokenExpiration() {
  // 1. Try to read from my-app-auth cookie
  const cookieVal = getCookie("my-app-auth");
  if (cookieVal) {
    const decoded = decodeJwt(cookieVal);
    if (decoded && decoded.exp) {
      return decoded.exp * 1000; // convert to ms
    }
  }

  // 2. Fallback to localStorage auth_expires_at
  const storedExpiresAt = localStorageUtil.get("auth_expires_at");
  if (storedExpiresAt) {
    return Number(storedExpiresAt);
  }

  return null;
}

/**
 * Saves the expiration timestamp of the given token to localStorage.
 */
export function saveAuthTokenExpiration(token) {
  if (!token) return;
  const decoded = decodeJwt(token);
  if (decoded && decoded.exp) {
    localStorageUtil.set("auth_expires_at", decoded.exp * 1000);
  }
}
