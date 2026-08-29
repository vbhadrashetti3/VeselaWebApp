"use client";

import axios from "axios";
import {
  getAccessToken,
  refreshAccessToken,
  handleAuthFailure,
  isAccessTokenExpiringSoon,
  hasPlausibleSession,
  isUnrecoverableAuthError,
} from "@/lib/tokenManager";

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ─── Refresh coordination ─────────────────────────────────────────────────────

let isRefreshing = false;
let refreshQueue = [];
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

function releaseRefreshLock(error) {
  clearTimeout(refreshSafetyTimer);
  refreshSafetyTimer = null;
  processQueue(error);
  isRefreshing = false;
}

async function runQueuedRefresh() {
  refreshSafetyTimer = setTimeout(() => {
    console.warn("[Auth] Token refresh timed out after 10 s. Force-releasing refresh lock.");
    releaseRefreshLock(new Error("Token refresh timed out"));
  }, 10_000);

  try {
    await refreshAccessToken({ force: true });
    releaseRefreshLock(null);
  } catch (refreshError) {
    releaseRefreshLock(refreshError);
    if (isUnrecoverableAuthError(refreshError)) {
      handleAuthFailure();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    throw refreshError;
  }
}

function attachBearerToken(config) {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

// ─── Request interceptor — proactive refresh + Bearer ─────────────────────────

api.interceptors.request.use(async (config) => {
  if (config.url?.includes("/dj-rest-auth/token/refresh/")) {
    return config;
  }

  if (typeof window !== "undefined") {
    const token = getAccessToken();

    // Only proactively refresh when we already hold an access token that is expiring.
    if (token && isAccessTokenExpiringSoon(token)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, config });
        });
      }

      isRefreshing = true;
      await runQueuedRefresh();
    }
  }

  return attachBearerToken(config);
});

// ─── Response interceptor — reactive 401 refresh ──────────────────────────────

function isRefreshExemptUrl(url = "") {
  return (
    url.includes("/dj-rest-auth/token/refresh/") ||
    url.includes("/dj-rest-auth/login/") ||
    url.includes("/dj-rest-auth/registration/") ||
    url.includes("/dj-rest-auth/logout/") ||
    url.includes("/api/auth/google/") ||
    url.includes("/api/sales_incoming_vesela/")
  );
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Guest / login / refresh failures are not recoverable sessions.
      // Retrying refresh here caused extra 401s and could hard-redirect visitors.
      if (isRefreshExemptUrl(originalRequest.url) || !hasPlausibleSession()) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        await runQueuedRefresh();
        return api(attachBearerToken(originalRequest));
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
