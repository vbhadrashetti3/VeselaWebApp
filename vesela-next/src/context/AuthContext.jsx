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
    const res = await fetch("/api/proxy/dj-rest-auth/token/refresh/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const data = await res.json();
      return data.access ?? data.access_token ?? null;
    }
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

  // Sync wsToken with sessionStorage so it survives page reloads
  // but gets cleared when the tab is closed.
  const [wsToken, setWsTokenState] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("vesela_ws_token") || null;
    }
    return null;
  });

  const setWsToken = useCallback((token) => {
    setWsTokenState(token);
    if (typeof window !== "undefined") {
      if (token) {
        sessionStorage.setItem("vesela_ws_token", token);
      } else {
        sessionStorage.removeItem("vesela_ws_token");
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

            // We must have a wsToken in memory / sessionStorage to authenticate the WebSocket.
            // If it is missing (e.g. new tab or page reload with HttpOnly cookies), we must refresh.
            const hasWsToken = typeof window !== "undefined" && !!sessionStorage.getItem("vesela_ws_token");

            if (isExpiringSoon || !hasWsToken) {
              console.log("[Auth] Stored expiration indicates expired/expiring soon, or wsToken is missing. Refreshing.");
              const freshToken = await fetchFreshAccessToken();
              if (freshToken) {
                setWsToken(freshToken);
                saveAuthTokenExpiration(freshToken);
                const freshDecoded = decodeJwt(freshToken);
                if (freshDecoded && freshDecoded.exp) {
                  scheduleRefresh(freshDecoded.exp * 1000);
                }
              }
            } else {
              console.log("[Auth] Stored expiration indicates valid token and wsToken is present. Skipping refresh call on page load.");
              scheduleRefresh(expiresAt);
            }
          }
        } else {
          // Not authenticated — clear any stale local data silently
          setUser(null);
          setWsToken(null);
          localStorageUtil.set(USER_DETAILS, {});
        }
      } catch {
        // Network failure — treat as unauthenticated; do not redirect
        setUser(null);
        setWsToken(null);
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
