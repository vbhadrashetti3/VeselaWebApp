"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { TOKEN, USER_DETAILS, PLAN_DETAILS, POST_LOGIN_NAVIGATE_TO } from "@/constant";
import { post } from "@/lib/apiService";

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

      // Clear storage
      localStorageUtil.remove(TOKEN);
      localStorageUtil.remove(POST_LOGIN_NAVIGATE_TO);
      localStorageUtil.set(USER_DETAILS, {});
      localStorageUtil.set(PLAN_DETAILS, {});

      onSuccess?.();
      router.push("/");
    }
  }, [router]);

  const value = {
    token,
    user,
    userId: user?.pk ?? null,
    isAuthenticated: Boolean(token),
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
