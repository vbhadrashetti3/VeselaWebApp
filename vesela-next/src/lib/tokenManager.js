/**
 * Central access-token manager for the web client.
 *
 * Web auth model (dj-rest-auth, JWT_AUTH_HTTPONLY=true):
 * - `access` always comes from JSON (login / refresh responses).
 * - `refresh` lives only in the HttpOnly `my-refresh-token` cookie (via same-origin proxy).
 * - WebSocket connects cross-origin to portal and requires `?token=<access>`.
 *
 * This module is the single place that refreshes tokens, schedules proactive
 * refresh, and notifies the rest of the app via custom events.
 */

import {
  decodeJwt,
  saveAuthTokenExpiration,
  clearAuthTokenExpiration,
} from "@/utils/authUtil";

/** sessionStorage key — tab-scoped only; never use localStorage for JWT access */
export const ACCESS_STORAGE_KEY = "vesela_access_token";

/** Legacy keys removed on clear */
const LEGACY_STORAGE_KEYS = ["vesela_ws_token"];

export const AUTH_REFRESHED_EVENT = "auth:sessionRefreshed";
export const AUTH_EXPIRED_EVENT = "auth:sessionExpired";

/** Refresh this many ms before access expiry (access lifetime = 1 day) */
const REFRESH_BUFFER_MS = 50 * 60 * 1000;

/** Treat token as "expiring soon" inside this window */
export const EXPIRY_THRESHOLD_MS = 60 * 60 * 1000;

const REFRESH_ENDPOINT = "/api/proxy/dj-rest-auth/token/refresh/";

let inMemoryAccessToken = null;
let refreshInFlight = null;
let proactiveRefreshTimer = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function tokenExpiresAtMs(token) {
  const decoded = decodeJwt(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
}

export function isAccessTokenExpired(token) {
  const expiresAt = tokenExpiresAtMs(token);
  if (!expiresAt) return true;
  return expiresAt <= Date.now();
}

export function isAccessTokenExpiringSoon(token) {
  const expiresAt = tokenExpiresAtMs(token);
  if (!expiresAt) return true;
  return expiresAt - Date.now() < EXPIRY_THRESHOLD_MS;
}

function readStoredAccessToken() {
  if (!isBrowser()) return null;
  const stored = sessionStorage.getItem(ACCESS_STORAGE_KEY);
  if (!stored || isAccessTokenExpired(stored)) {
    sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    return null;
  }
  return stored;
}

function clearProactiveRefreshTimer() {
  if (proactiveRefreshTimer) {
    clearTimeout(proactiveRefreshTimer);
    proactiveRefreshTimer = null;
  }
}

function scheduleProactiveRefresh(token) {
  clearProactiveRefreshTimer();
  if (!isBrowser() || !token) return;

  const expiresAt = tokenExpiresAtMs(token);
  if (!expiresAt) return;

  const refreshAt = expiresAt - REFRESH_BUFFER_MS;
  const delay = refreshAt - Date.now();

  const runRefresh = () => {
    refreshAccessToken({ force: true }).catch(() => {
      handleAuthFailure();
    });
  };

  if (delay <= 0) {
    runRefresh();
  } else {
    proactiveRefreshTimer = setTimeout(runRefresh, delay);
  }
}

function dispatchRefreshed(token) {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent(AUTH_REFRESHED_EVENT, { detail: { token } }),
  );
}

/**
 * Returns the current access token (memory → valid sessionStorage).
 */
export function getAccessToken() {
  if (inMemoryAccessToken && !isAccessTokenExpired(inMemoryAccessToken)) {
    return inMemoryAccessToken;
  }

  const stored = readStoredAccessToken();
  if (stored) {
    inMemoryAccessToken = stored;
    return stored;
  }

  inMemoryAccessToken = null;
  return null;
}

/**
 * Persist access token for this tab and schedule proactive refresh.
 */
export function setAccessToken(token) {
  inMemoryAccessToken = token ?? null;

  if (!isBrowser()) return;

  if (token) {
    sessionStorage.setItem(ACCESS_STORAGE_KEY, token);
    saveAuthTokenExpiration(token);
    scheduleProactiveRefresh(token);
  } else {
    sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    clearAuthTokenExpiration();
    clearProactiveRefreshTimer();
  }
}

/**
 * Clear all client-side access token state (does not call logout API).
 */
export function clearAccessToken() {
  inMemoryAccessToken = null;
  clearProactiveRefreshTimer();

  if (!isBrowser()) return;

  sessionStorage.removeItem(ACCESS_STORAGE_KEY);
  clearAuthTokenExpiration();

  for (const key of LEGACY_STORAGE_KEYS) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
}

/**
 * Refresh access token using HttpOnly refresh cookie (empty JSON body).
 * Deduplicates concurrent callers.
 *
 * @param {{ force?: boolean }} options
 * @returns {Promise<string>} new access token
 */
export async function refreshAccessToken({ force = false } = {}) {
  const current = getAccessToken();
  if (!force && current && !isAccessTokenExpiringSoon(current)) {
    return current;
  }

  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const res = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error(`Token refresh failed (${res.status})`);
    }

    const data = await res.json();
    const newAccess = data.access ?? data.access_token ?? null;

    if (!newAccess) {
      throw new Error("Token refresh response missing access");
    }

    setAccessToken(newAccess);
    dispatchRefreshed(newAccess);
    return newAccess;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

/**
 * Ensure a valid access token exists; refresh if missing or expiring.
 * @returns {Promise<string|null>}
 */
export async function ensureAccessToken() {
  const current = getAccessToken();
  if (current && !isAccessTokenExpiringSoon(current)) {
    return current;
  }

  try {
    return await refreshAccessToken({ force: !current });
  } catch {
    return null;
  }
}

/**
 * Unrecoverable auth failure — clear token and notify listeners.
 */
export function handleAuthFailure() {
  clearAccessToken();
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

/**
 * Remove legacy localStorage copies of access tokens from older builds.
 */
export function migrateLegacyTokenStorage() {
  if (!isBrowser()) return;
  for (const key of LEGACY_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}
