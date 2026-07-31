"use client";

import axios from "axios";
import { getAuthTokenExpiration, saveAuthTokenExpiration } from "@/utils/authUtil";

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  // Send cookies (session, CSRF, etc.) automatically on every request
  withCredentials: true,
});

// ─── Refresh token state ──────────────────────────────────────────────────────

// Whether a refresh call is already in-flight
let isRefreshing = false;

// Callbacks waiting for the refresh to complete
// Each item: { resolve, reject, config }
let refreshQueue = [];

// Safety timeout: if a refresh call hangs (backend unresponsive), we force-
// release the lock after 15 s so queued requests are rejected rather than
// blocked forever, which would leave the UI permanently frozen.
let refreshSafetyTimer = null;

function processQueue(error) {
  for (const item of refreshQueue) {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(api(item.config));
    }
  }
  refreshQueue = [];
}

/** Drains the queue, clears the safety timer, and resets the lock. */
function releaseRefreshLock(error) {
  clearTimeout(refreshSafetyTimer);
  refreshSafetyTimer = null;
  processQueue(error);
  isRefreshing = false;
}

/**
 * Executes a token refresh call.
 * Centralized so both request and response interceptors can trigger it.
 */
async function performTokenRefresh() {
  // Arm safety timer: if the backend hangs, force-release the lock after 15 s.
  refreshSafetyTimer = setTimeout(() => {
    console.warn("[Auth] Token refresh timed out after 15 s. Force-releasing refresh lock.");
    releaseRefreshLock(new Error("Token refresh timed out"));
  }, 15_000);

  const refreshResponse = await axios.post(
    "/api/proxy/dj-rest-auth/token/refresh/",
    {},
    { withCredentials: true },
  );

  const newAccessToken =
    refreshResponse.data?.access ||
    refreshResponse.data?.access_token ||
    null;

  if (newAccessToken) {
    // Save expiration timestamp locally
    saveAuthTokenExpiration(newAccessToken);

    // Notify AuthContext so it gets the fresh in-memory wsToken
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth:sessionRefreshed", {
          detail: { token: newAccessToken },
        })
      );
    }
  }
}

// ─── Request interceptor — handles proactive refresh ─────────────────────────

api.interceptors.request.use(async (config) => {
  // Bypasses check for the refresh endpoint itself to prevent infinite loop
  if (config.url?.includes("/dj-rest-auth/token/refresh/")) {
    return config;
  }

  if (typeof window !== "undefined") {
    const expiresAt = getAuthTokenExpiration();
    if (expiresAt) {
      const oneHour = 60 * 60 * 1000;
      const isExpiringSoon = expiresAt - Date.now() < oneHour;

      if (isExpiringSoon) {
        if (isRefreshing) {
          // A refresh is already running — queue the request and wait
          return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject, config });
          });
        }

        isRefreshing = true;

        try {
          await performTokenRefresh();
          releaseRefreshLock(null);
        } catch (refreshError) {
          releaseRefreshLock(refreshError);

          // Force session logout and redirect on failure
          window.dispatchEvent(new CustomEvent("auth:sessionExpired"));
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }
    }
  }
  return config;
});

// ─── Response interceptor — handles reactive 401 refresh ──────────────────────

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors that haven't already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // A refresh is already running — queue this request and wait
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        await performTokenRefresh();
        releaseRefreshLock(null);
        return api(originalRequest);
      } catch (refreshError) {
        releaseRefreshLock(refreshError);

        // Force session logout and redirect on failure
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:sessionExpired"));
          window.location.href = "/";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
