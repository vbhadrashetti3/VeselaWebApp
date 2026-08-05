"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { USER_DETAILS, PLAN_DETAILS, POST_LOGIN_NAVIGATE_TO, WELCOME_COMPLETED } from "@/constant";
import { post } from "@/lib/apiService";
import { getPlan } from "@/services/auth.service";
import {
  decodeJwt,
  getCookie,
  getAuthTokenExpiration,
  saveAuthTokenExpiration,
} from "@/utils/authUtil";

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Fetch a fresh access token via the refresh endpoint using cookies.
 * Uses native fetch so the axios interceptor is never involved.
 * Returns the access token string, or null on failure.
 */
async function fetchFreshAccessToken() {
  try {
    // Try to read the refresh token from document.cookie.
    // If the cookie is HttpOnly (JS-unreadable), this returns null and we send
    // {} — the browser still forwards the HttpOnly cookie automatically via
    // credentials:"include", so Django reads it from the cookie header.
    const refreshToken = getCookie("my-refresh-token");

    const res = await fetch("/api/proxy/dj-rest-auth/token/refresh/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshToken ? { refresh: refreshToken } : {}),
    });
    if (res.ok) {
      const data = await res.json();
      return data.access ?? data.access_token ?? null;
    }
    console.warn("[Auth] Token refresh returned", res.status);
  } catch {
    // Swallow — caller handles null
  }
  return null;
}

// ─── Provider ──────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  // User comes from localStorage as a fast initial render, then is verified /
  // refreshed from the backend on mount via the cookie session.
  const [user, setUser] = useState(() => {
    const stored = localStorageUtil.get(USER_DETAILS);
    if (!stored || (typeof stored === "object" && !stored.pk)) return null;
    return stored;
  });

  const [plan, setPlan] = useState(() => {
    const stored = localStorageUtil.get(PLAN_DETAILS);
    if (!stored || typeof stored !== "object" || !stored.plan) return null;
    return stored.plan;
  });
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);

  // Tracks whether we have finished the initial session check so AuthGuard
  // doesn't flash a redirect before we know if the cookie session is valid.
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  // Tracks whether the token is fully ready for use (refresh check complete).
  // The WebSocket must NOT connect until this is true, otherwise it connects
  // before a fresh token is available and the server closes it with a 4xxx code.
  const [isTokenReady, setIsTokenReady] = useState(false);

  // Sync wsToken with localStorage and sessionStorage so it survives page reloads,
  // new tabs, and browser restarts.
  const [wsToken, setWsTokenState] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("vesela_ws_token") || localStorage.getItem("vesela_ws_token");
      if (stored) {
        const decoded = decodeJwt(stored);
        if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
          return stored;
        }
      }
    }
    return null;
  });

  const setWsToken = useCallback((token) => {
    setWsTokenState(token);
    if (typeof window !== "undefined") {
      if (token) {
        sessionStorage.setItem("vesela_ws_token", token);
        localStorage.setItem("vesela_ws_token", token);
      } else {
        sessionStorage.removeItem("vesela_ws_token");
        localStorage.removeItem("vesela_ws_token");
      }
    }
  }, []);

  const isFetchingPlanRef = useRef(false);
  const refreshTimeoutRef = useRef(null);

  // Keep localStorage in sync with user state
  useEffect(() => {
    if (user) {
      localStorageUtil.set(USER_DETAILS, user);
    }
  }, [user]);

  // ── Automatic token refresh timer ──────────────────────────────────────────

  const scheduleRefreshRef = useRef(null);

  const scheduleRefresh = useCallback((expiresAt) => {
    if (typeof window === "undefined" || !expiresAt) return;

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const oneHour = 60 * 60 * 1000;
    const buffer = 50 * 60 * 1000; // Refresh 50 minutes before expiration (within the last hour)
    const refreshTime = expiresAt - buffer;
    const delay = refreshTime - Date.now();

    if (delay <= 0) {
      // Already within the last hour (or expired) - trigger immediate proactive refresh
      console.log("[Auth] Token is expiring soon or expired. Triggering proactive refresh.");
      fetchFreshAccessToken().then((newToken) => {
        if (newToken) {
          setWsToken(newToken);
          const decoded = decodeJwt(newToken);
          if (decoded && decoded.exp) {
            saveAuthTokenExpiration(newToken);
            scheduleRefreshRef.current?.(decoded.exp * 1000);
          }
        }
      });
    } else {
      console.log(`[Auth] Scheduling automatic token refresh in ${Math.round(delay / 1000 / 60)} minutes.`);
      refreshTimeoutRef.current = setTimeout(() => {
        console.log("[Auth] Timer fired. Triggering automatic token refresh.");
        fetchFreshAccessToken().then((newToken) => {
          if (newToken) {
            setWsToken(newToken);
            const decoded = decodeJwt(newToken);
            if (decoded && decoded.exp) {
              saveAuthTokenExpiration(newToken);
              scheduleRefreshRef.current?.(decoded.exp * 1000);
            }
          }
        });
      }, delay);
    }
  }, [setWsToken]);

  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh;
  }, [scheduleRefresh]);

  // ── Session hydration on mount ────────────────────────────────────────────
  // Uses native fetch (NOT the axios instance) so the refresh interceptor is
  // never triggered here. A 401 from this endpoint simply means "no active
  // cookie session" — it must NOT trigger the refresh → redirect loop.
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/proxy/dj-rest-auth/user/", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorageUtil.set(USER_DETAILS, data);

          // 1. Try to read token from my-app-auth cookie
          const cookieToken = getCookie("my-app-auth");
          if (cookieToken) {
            console.log("[Auth] Found my-app-auth cookie on page load.");
            setWsToken(cookieToken);
            saveAuthTokenExpiration(cookieToken);

            const decoded = decodeJwt(cookieToken);
            if (decoded && decoded.exp) {
              const expiresAt = decoded.exp * 1000;
              const oneHour = 60 * 60 * 1000;
              const isExpiringSoon = expiresAt - Date.now() < oneHour;

              if (isExpiringSoon) {
                console.log("[Auth] Cookie token is expiring soon. Refreshing on page load.");
                const freshToken = await fetchFreshAccessToken();
                if (freshToken) {
                  setWsToken(freshToken);
                  saveAuthTokenExpiration(freshToken);
                  const freshDecoded = decodeJwt(freshToken);
                  if (freshDecoded && freshDecoded.exp) {
                    scheduleRefresh(freshDecoded.exp * 1000);
                  }
                } else {
                  console.warn("[Auth] Token refresh failed on page load. Will rely on cookie-based session.");
                }
              } else {
                console.log("[Auth] Cookie token is still valid. Skipping refresh call on page load.");
                scheduleRefresh(expiresAt);
              }
            }
          } else {
            const expiresAt = getAuthTokenExpiration();
            const oneHour = 60 * 60 * 1000;
            const isExpiringSoon = !expiresAt || (expiresAt - Date.now() < oneHour);

            const currentWsToken = typeof window !== "undefined"
              ? (sessionStorage.getItem("vesela_ws_token") || localStorage.getItem("vesela_ws_token"))
              : null;

            // Fetch a fresh token if wsToken is missing or expiring soon
            if (!currentWsToken || isExpiringSoon) {
              console.log("[Auth] wsToken is missing or expiring soon. Refreshing access token on session check...");
              const freshToken = await fetchFreshAccessToken();
              if (freshToken) {
                setWsToken(freshToken);
                saveAuthTokenExpiration(freshToken);
                const freshDecoded = decodeJwt(freshToken);
                if (freshDecoded && freshDecoded.exp) {
                  scheduleRefresh(freshDecoded.exp * 1000);
                }
              } else {
                console.warn(
                  "[Auth] WS token refresh failed on page load. Session is valid; user can reconnect when online.",
                );
              }
            } else {
              console.log("[Auth] Stored wsToken is valid. Skipping refresh call on page load.");
              if (!wsToken && currentWsToken) {
                setWsToken(currentWsToken);
              }
              if (expiresAt) {
                scheduleRefresh(expiresAt);
              }
            }
          }
          // Mark session as ready. User is authenticated regardless of whether
          // the WS token refresh succeeded — that is a secondary concern.
          setIsTokenReady(true);
         } else if (res.status === 401 || res.status === 403) {
          // Definitive unauthenticated response from the backend — clear state.
          setUser(null);
          setWsToken(null);
          setIsTokenReady(false);
          localStorageUtil.set(USER_DETAILS, {});
        } else {
          // 503 (upstream unreachable), 500, or any other non-auth error:
          // treat as a transient failure. Keep existing user state from
          // localStorage so the UI doesn't flash the login page on a brief
          // network outage. isSessionChecked will still be set to true below
          // so the app doesn't block forever.
          console.warn(`[Auth] Session check returned ${res.status} — treating as transient, preserving cached state.`);
        }
      } catch {
        // Network/fetch failure (e.g. no internet, CORS, DNS).
        // Same policy as 503: keep existing state, do not clear the user.
        console.warn("[Auth] Session check fetch failed (network error) — preserving cached state.");
      } finally {
        setIsSessionChecked(true);
      }
    };

    checkSession();
  }, [scheduleRefresh, setWsToken]); // Runs once on mount

  // ── Listen for events from axios interceptor ─────────────────────────────
  useEffect(() => {
    const handleExpired = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      setUser(null);
      setWsToken(null);
      setPlan(null);
      localStorageUtil.set(USER_DETAILS, {});
      localStorageUtil.set(PLAN_DETAILS, {});
      localStorageUtil.remove("auth_expires_at");
    };

    const handleRefreshed = (e) => {
      const token = e.detail?.token;
      if (token) {
        setWsToken(token);
        setIsTokenReady(true);
        const decoded = decodeJwt(token);
        if (decoded && decoded.exp) {
          scheduleRefresh(decoded.exp * 1000);
        }
      }
    };

    window.addEventListener("auth:sessionExpired", handleExpired);
    window.addEventListener("auth:sessionRefreshed", handleRefreshed);

    return () => {
      window.removeEventListener("auth:sessionExpired", handleExpired);
      window.removeEventListener("auth:sessionRefreshed", handleRefreshed);
    };
  }, [scheduleRefresh, setWsToken]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // ── login ────────────────────────────────────────────────────────────────
  /**
   * Call this after a successful login/signup API response.
   * @param {object} newUser  - User object from the response body.
   * @param {string} [accessToken] - Access token from the response body,
   *   stored in-memory only for WS use (never written to localStorage).
   */
  const login = useCallback((newUser, accessToken = null) => {
    if (newUser) {
      localStorageUtil.set(USER_DETAILS, newUser);
      setUser(newUser);
    }
    // Store access token in memory for cross-domain WS authentication
    setWsToken(accessToken ?? null);

    if (accessToken) {
      saveAuthTokenExpiration(accessToken);
      const decoded = decodeJwt(accessToken);
      if (decoded && decoded.exp) {
        scheduleRefresh(decoded.exp * 1000);
      }
    }
    // Token is immediately ready after a fresh login
    setIsTokenReady(true);
  }, [scheduleRefresh, setWsToken]);

  // ── logout ───────────────────────────────────────────────────────────────
  /** Clears auth state, storage, and redirects to home. */
  const logout = useCallback(async (onSuccess) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    try {
      await post("/dj-rest-auth/logout/");
    } catch {
      // Ignore — we always clear local state regardless
    } finally {
      // Clear state
      setUser(null);
      setWsToken(null);
      setPlan(null);
      setPlanError(null);
      setIsLoadingPlan(false);
      setIsTokenReady(false);

      // Clear storage
      localStorageUtil.remove(POST_LOGIN_NAVIGATE_TO);
      localStorageUtil.remove(WELCOME_COMPLETED);
      localStorageUtil.remove("auth_expires_at");
      if (typeof window !== "undefined") {
        localStorage.removeItem("vesela_active_conversation_id");
      }
      localStorageUtil.set(USER_DETAILS, {});
      localStorageUtil.set(PLAN_DETAILS, {});

      onSuccess?.();
      router.push("/");
    }
  }, [router, setWsToken]);

  // ── fetchPlan ─────────────────────────────────────────────────────────────
  const fetchPlan = useCallback(async () => {
    if (!user) return;
    if (isFetchingPlanRef.current) return;
    isFetchingPlanRef.current = true;

    setIsLoadingPlan(true);
    setPlanError(null);

    try {
      const res = await getPlan();
      if (!res.error && res.status === 200 && res.data) {
        setPlan(res.data.plan);
        localStorageUtil.set(PLAN_DETAILS, res.data);
      } else {
        if (res.status === 401) {
          // Session expired — logout to clear state
          logout();
        } else {
          setPlanError(res.message || "Failed to fetch subscription plan");
        }
      }
    } catch (err) {
      setPlanError(err?.message || "An error occurred fetching subscription plan");
    } finally {
      setIsLoadingPlan(false);
      isFetchingPlanRef.current = false;
    }
  }, [user, logout]);

  // Automatically fetch subscription plan when user is authenticated
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPlan();
    } else {
      setPlan(null);
    }
  }, [user, fetchPlan]);

  const value = {
    user,
    userId: user?.pk ?? null,
    isAuthenticated: Boolean(user),
    isSessionChecked,
    isTokenReady,
    wsToken,
    plan,
    isLoadingPlan,
    planError,
    isPro: plan === "pro",
    isFree: plan === "free" || !plan,
    fetchPlan,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
