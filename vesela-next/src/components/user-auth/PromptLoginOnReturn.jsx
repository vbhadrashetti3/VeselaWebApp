"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "@/components/modals/modalConstants";
import { PROMPT_LOGIN } from "@/constant";

/**
 * If a prior session expired, open the login modal on the marketing home page.
 * Triggered by ?login=1 and/or sessionStorage vesela_prompt_login.
 */
export default function PromptLoginOnReturn() {
  const { isAuthenticated, isSessionChecked } = useAuth();
  const { openModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const promptedRef = useRef(false);

  useEffect(() => {
    if (!isSessionChecked || isAuthenticated || promptedRef.current) return;
    if (pathname !== "/" && pathname !== "/home") return;

    let fromQuery = false;
    let fromFlag = false;
    try {
      fromQuery = new URLSearchParams(window.location.search).get("login") === "1";
      fromFlag = sessionStorage.getItem(PROMPT_LOGIN) === "1";
    } catch {
      return;
    }

    if (!fromQuery && !fromFlag) return;

    promptedRef.current = true;
    try {
      sessionStorage.removeItem(PROMPT_LOGIN);
    } catch {
      /* ignore */
    }

    if (fromQuery) {
      router.replace(pathname, { scroll: false });
    }

    openModal(MODALS.LOGIN, { source: "public" });
  }, [isAuthenticated, isSessionChecked, openModal, pathname, router]);

  return null;
}
