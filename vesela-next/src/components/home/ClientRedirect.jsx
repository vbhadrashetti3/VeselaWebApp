"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { WELCOME_COMPLETED } from "@/constant";

/**
 * ClientRedirect — mounted only on the "/" route.
 *
 * Decision flow:
 *   NOT authenticated          → no-op (landing page is shown)
 *   authenticated + no flag    → /welcome  (first-time or onboarding not done)
 *   authenticated + flag set   → /chat     (returning user)
 *
 * The WELCOME_COMPLETED flag is set by the /welcome page on mount.
 * It is cleared by AuthContext.logout() so the flow resets on account change.
 */
export default function ClientRedirect() {
  const { isAuthenticated, isSessionChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSessionChecked || !isAuthenticated) return;

    const hasCompletedWelcome = localStorageUtil.get(WELCOME_COMPLETED);
    if (hasCompletedWelcome) {
      router.replace("/chat");
    } else {
      router.replace("/welcome");
    }
  }, [isAuthenticated, isSessionChecked, router]);

  return null;
}
