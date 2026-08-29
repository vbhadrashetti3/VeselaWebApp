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
import { USER_DETAILS, PLAN_DETAILS, POST_LOGIN_NAVIGATE_TO, WELCOME_COMPLETED, AUTH_LIMIT_LOCKED } from "@/constant";
import { post } from "@/lib/apiService";
import { getPlan } from "@/services/auth.service";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  refreshAccessToken,
  migrateLegacyTokenStorage,
  hasPlausibleSession,
  handleAuthFailure,
  isAccessTokenExpiringSoon,
  isUnrecoverableAuthError,
  AUTH_REFRESHED_EVENT,
  AUTH_EXPIRED_EVENT,
} from "@/lib/tokenManager";

async function fetchSessionUser(access) {
  return fetch("/api/proxy/dj-rest-auth/user/", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  });
}

const PRIVATE_REAUTH_PATHS = new Set(["/chat", "/welcome", "/change-password"]);

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(() => {
    const stored = localStorageUtil.get(USER_DETAILS);
    if (!stored || (typeof stored === "object" && !stored.pk)) return null;
    return stored;
  });

  const [planDetails, setPlanDetails] = useState(() => {
    const stored = localStorageUtil.get(PLAN_DETAILS);
    if (!stored || typeof stored !== "object") return null;
    return stored;
  });
  const [plan, setPlan] = useState(() => planDetails?.plan ?? null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);

  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [isTokenReady, setIsTokenReady] = useState(false);

  // Access token for cross-origin WebSocket (?token=). Sourced from tokenManager.
  const [wsToken, setWsTokenState] = useState(() =>
    typeof window !== "undefined" ? getAccessToken() : null,
  );

  const isFetchingPlanRef = useRef(false);
  const isRecoveringSessionRef = useRef(false);

  useEffect(() => {
    if (user) {
      localStorageUtil.set(USER_DETAILS, user);
    }
  }, [user]);

  const applyAccessToken = useCallback((access) => {
    if (!access) return;
    setWsTokenState(access);
    setIsTokenReady(true);
  }, []);

  /**
   * Mint a valid access JWT from the HttpOnly refresh cookie when the current
   * access token is missing or close to expiry. Only logs out on 401/403.
   * @returns {Promise<string|null>}
   */
  const recoverAccessToken = useCallback(async () => {
    const current = getAccessToken();
    if (current && !isAccessTokenExpiringSoon(current)) {
      applyAccessToken(current);
      return current;
    }

    try {
      const access = await refreshAccessToken({ force: true });
      applyAccessToken(access);
      return access;
    } catch (err) {
      if (isUnrecoverableAuthError(err)) {
        handleAuthFailure();
        return null;
      }
      console.warn("[Auth] Token refresh failed transiently — preserving session.");
      const fallback = getAccessToken();
      if (fallback) applyAccessToken(fallback);
      return fallback;
    }
  }, [applyAccessToken]);

  // ── Session hydration on mount ────────────────────────────────────────────
  // Refresh FIRST, then GET /user/ with the new Bearer token.
  // GET /user/ authenticates with access, not refresh — calling it first on an
  // expired access JWT logs the user out while the 7-day refresh cookie is valid.
  useEffect(() => {
    migrateLegacyTokenStorage();

    const checkSession = async () => {
      if (!hasPlausibleSession()) {
        clearAccessToken();
        setUser(null);
        setWsTokenState(null);
        setIsTokenReady(false);
        localStorageUtil.set(USER_DETAILS, {});
        setIsSessionChecked(true);
        return;
      }

      try {
        const access = await recoverAccessToken();
        if (!access) {
          return;
        }

        const res = await fetchSessionUser(access);

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorageUtil.set(USER_DETAILS, data);
        } else if (res.status === 401 || res.status === 403) {
          handleAuthFailure();
        } else {
          console.warn(
            `[Auth] Session check returned ${res.status} — preserving cached state.`,
          );
        }
      } catch {
        console.warn("[Auth] Session check fetch failed — preserving cached state.");
        const access = getAccessToken();
        if (access) applyAccessToken(access);
      } finally {
        setIsSessionChecked(true);
      }
    };

    checkSession();
    // Mount-only hydrate; recoverAccessToken is used from this closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tab focus / visibility: refresh expired access, stay on this page ─────
  // Do not reload — token rotation already reconnects the chat WebSocket.
  useEffect(() => {
    if (!isSessionChecked) return;

    const recoverIfNeeded = async () => {
      if (isRecoveringSessionRef.current) return;
      if (!hasPlausibleSession()) return;

      const current = getAccessToken();
      if (current && !isAccessTokenExpiringSoon(current)) return;

      isRecoveringSessionRef.current = true;
      try {
        await recoverAccessToken();
      } finally {
        isRecoveringSessionRef.current = false;
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        recoverIfNeeded();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", recoverIfNeeded);
    window.addEventListener("online", recoverIfNeeded);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", recoverIfNeeded);
      window.removeEventListener("online", recoverIfNeeded);
    };
  }, [isSessionChecked, recoverAccessToken]);

  // ── Cross-module auth events (axios / WebSocket / tokenManager) ───────────
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setWsTokenState(null);
      setPlan(null);
      setIsTokenReady(false);
      localStorageUtil.set(USER_DETAILS, {});
      localStorageUtil.set(PLAN_DETAILS, {});
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_LIMIT_LOCKED);
        if (PRIVATE_REAUTH_PATHS.has(window.location.pathname)) {
          router.replace("/?login=1");
        }
      }
    };

    const handleRefreshed = (e) => {
      const token = e.detail?.token;
      if (token) {
        setWsTokenState(token);
        setIsTokenReady(true);
      }
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    window.addEventListener(AUTH_REFRESHED_EVENT, handleRefreshed);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
      window.removeEventListener(AUTH_REFRESHED_EVENT, handleRefreshed);
    };
  }, [router]);

  // ── login ────────────────────────────────────────────────────────────────
  const login = useCallback((newUser, accessToken = null) => {
    if (newUser) {
      localStorageUtil.set(USER_DETAILS, newUser);
      setUser(newUser);
    }

    if (accessToken) {
      setAccessToken(accessToken);
      setWsTokenState(accessToken);
      setIsTokenReady(true);
      return;
    }

    // Cookie-only path: immediately refresh to read access from JSON body.
    refreshAccessToken({ force: true })
      .then((token) => {
        setWsTokenState(token);
        setIsTokenReady(true);
      })
      .catch(() => {
        clearAccessToken();
        setUser(null);
        setWsTokenState(null);
        setIsTokenReady(false);
      });
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async (onSuccess) => {
    try {
      await post("/dj-rest-auth/logout/");
    } catch {
      // Always clear local state
    } finally {
      clearAccessToken();
      setUser(null);
      setWsTokenState(null);
      setPlan(null);
      setPlanError(null);
      setIsLoadingPlan(false);
      setIsTokenReady(false);

      localStorageUtil.remove(POST_LOGIN_NAVIGATE_TO);
      localStorageUtil.remove(WELCOME_COMPLETED);
      if (typeof window !== "undefined") {
        localStorage.removeItem("vesela_active_conversation_id");
        localStorage.removeItem(AUTH_LIMIT_LOCKED);
      }
      localStorageUtil.set(USER_DETAILS, {});
      localStorageUtil.set(PLAN_DETAILS, {});

      onSuccess?.();
      router.push("/");
    }
  }, [router]);

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
        setPlanDetails(res.data);
        localStorageUtil.set(PLAN_DETAILS, res.data);
        // Paid plans are not subject to the free daily cap; drop any stale UI lock.
        if (res.data.plan && res.data.plan !== "free" && typeof window !== "undefined") {
          localStorage.removeItem(AUTH_LIMIT_LOCKED);
        }
      } else if (res.status === 401) {
        logout();
      } else {
        setPlanError(res.message || "Failed to fetch subscription plan");
      }
    } catch (err) {
      setPlanError(err?.message || "An error occurred fetching subscription plan");
    } finally {
      setIsLoadingPlan(false);
      isFetchingPlanRef.current = false;
    }
  }, [user, logout]);

  useEffect(() => {
    if (!isSessionChecked) return;
    if (user) {
      fetchPlan();
    } else {
      setPlan(null);
      setPlanDetails(null);
    }
  }, [user, fetchPlan, isSessionChecked]);

  const value = {
    user,
    userId: user?.pk ?? null,
    isAuthenticated: Boolean(user),
    isSessionChecked,
    isTokenReady,
    wsToken,
    plan,
    planDetails,
    canManageStripeBilling: Boolean(planDetails?.can_manage_stripe_billing),
    isLoadingPlan,
    planError,
    isPro: Boolean(plan) && plan !== "free",
    isFree: !plan || plan === "free",
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
