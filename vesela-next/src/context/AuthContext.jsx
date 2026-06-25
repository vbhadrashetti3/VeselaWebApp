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
import { TOKEN, USER_DETAILS, PLAN_DETAILS, POST_LOGIN_NAVIGATE_TO } from "@/constant";
import { post } from "@/lib/apiService";
import { getPlan } from "@/services/auth.service";

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  // Bootstrap from localStorage on first client render
  const [token, setToken] = useState(() => localStorageUtil.get(TOKEN));
  const [user, setUser] = useState(() => {
    const stored = localStorageUtil.get(USER_DETAILS);
    // stored may be a plain object or a JSON string
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

  const isFetchingPlanRef = useRef(false);

  // Keep localStorage in sync whenever state changes
  useEffect(() => {
    if (token) {
      localStorageUtil.set(TOKEN, token);
    } else {
      localStorageUtil.remove(TOKEN);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorageUtil.set(USER_DETAILS, user);
    }
  }, [user]);

  // ── login ────────────────────────────────────────────────────────────────
  /** Call this after a successful login API response. */
  const login = useCallback((newToken, newUser) => {
    if (newToken) {
      localStorageUtil.set(TOKEN, newToken);
    }
    if (newUser) {
      localStorageUtil.set(USER_DETAILS, newUser);
    }
    setToken(newToken);
    setUser(newUser);
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────
  /** Clears auth state, storage, and redirects to home. */
  const logout = useCallback(async (onSuccess) => {
    try {
      await post("/dj-rest-auth/logout/");
    } catch {
      // Ignore — we always clear local state regardless
    } finally {
      // Clear state
      setToken(null);
      setUser(null);
      setPlan(null);
      setPlanError(null);
      setIsLoadingPlan(false);

      // Clear storage
      localStorageUtil.remove(TOKEN);
      localStorageUtil.remove(POST_LOGIN_NAVIGATE_TO);
      localStorageUtil.set(USER_DETAILS, {});
      localStorageUtil.set(PLAN_DETAILS, {});

      onSuccess?.();
      router.push("/");
    }
  }, [router]);

  // ── fetchPlan ─────────────────────────────────────────────────────────────
  const fetchPlan = useCallback(async () => {
    if (!token) return;
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
          // Token expired/invalid, logout to clear session
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
  }, [token, logout]);

  // Automatically fetch subscription plan when token is present
  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPlan();
    } else {
      setPlan(null);
    }
  }, [token, fetchPlan]);

  const value = {
    token,
    user,
    userId: user?.pk ?? null,
    isAuthenticated: Boolean(token),
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
