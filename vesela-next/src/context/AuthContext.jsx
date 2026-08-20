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
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  ensureAccessToken,
  refreshAccessToken,
  migrateLegacyTokenStorage,
  hasPlausibleSession,
  AUTH_REFRESHED_EVENT,
  AUTH_EXPIRED_EVENT,
} from "@/lib/tokenManager";

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

  useEffect(() => {
    if (user) {
      localStorageUtil.set(USER_DETAILS, user);
    }
  }, [user]);

  // ── Session hydration on mount ────────────────────────────────────────────
  // When client state suggests a prior login (cached user or access token):
  //   1. GET /dj-rest-auth/user/ — confirms the cookie session is still valid.
  //   2. ensureAccessToken() — returns cached access JWT or POSTs /token/refresh/.
  // Anonymous visitors skip the network call so public pages don't log 401 noise.
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
        const res = await fetch("/api/proxy/dj-rest-auth/user/", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(getAccessToken()
              ? { Authorization: `Bearer ${getAccessToken()}` }
              : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorageUtil.set(USER_DETAILS, data);

          // Step 2: access token for WebSocket / Bearer (refresh only if needed).
          const access = await ensureAccessToken();
          if (access) {
            setWsTokenState(access);
            setIsTokenReady(true);
          } else {
            // Refresh cookie missing/expired — end session cleanly.
            console.warn("[Auth] Valid session but token refresh failed. Logging out.");
            clearAccessToken();
            setUser(null);
            setWsTokenState(null);
            setIsTokenReady(false);
            localStorageUtil.set(USER_DETAILS, {});
          }
        } else if (res.status === 401 || res.status === 403) {
          clearAccessToken();
          setUser(null);
          setWsTokenState(null);
          setIsTokenReady(false);
          localStorageUtil.set(USER_DETAILS, {});
        } else {
          console.warn(
            `[Auth] Session check returned ${res.status} — preserving cached state.`,
          );
          // Best-effort token recovery when backend is flaky but user cache exists.
          const access = await ensureAccessToken();
          if (access) {
            setWsTokenState(access);
            setIsTokenReady(true);
          }
        }
      } catch {
        console.warn("[Auth] Session check fetch failed — preserving cached state.");
        const access = await ensureAccessToken();
        if (access) {
          setWsTokenState(access);
          setIsTokenReady(true);
        }
      } finally {
        setIsSessionChecked(true);
      }
    };

    checkSession();
  }, []);

  // ── Cross-module auth events (axios / WebSocket / tokenManager) ───────────
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setWsTokenState(null);
      setPlan(null);
      setIsTokenReady(false);
      localStorageUtil.set(USER_DETAILS, {});
      localStorageUtil.set(PLAN_DETAILS, {});
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
  }, []);

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
