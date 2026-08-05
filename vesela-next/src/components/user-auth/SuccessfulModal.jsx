"use client";

import { useEffect } from "react";
import { useModal } from "@/context/ModalContext";
import { POST_LOGIN_NAVIGATE_TO } from "@/constant";
import { useRouter } from "next/navigation";
import { localStorageUtil } from "@/utils/localStorageUtil";

/**
 * SuccessfulModal — shown immediately after a successful login or sign-up.
 *
 * Navigates instantly (no delay) to the correct post-login destination:
 *   - A previously-stored intended destination (POST_LOGIN_NAVIGATE_TO), or
 *   - /welcome (the Hero Chat entry point) for all users.
 *
 * Always goes to /welcome because WELCOME_COMPLETED is set the moment
 * WelcomePage mounts — checking it would always route returning users to
 * /chat, which is wrong. /welcome IS the Hero Chat interface.
 *
 * The modal closes at the same time so the transition feels seamless.
 */
const SuccessfulModal = () => {
  const { closeModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    // Honor a specific redirect destination stored before the login modal opened.
    const redirectTo = localStorageUtil.get(POST_LOGIN_NAVIGATE_TO);
    if (redirectTo) {
      localStorageUtil.remove(POST_LOGIN_NAVIGATE_TO);
      router.push(redirectTo);
    } else {
      // Always send to /welcome — it is the Hero Chat entry point.
      router.push("/welcome");
    }
    // Close the modal at the same tick so no stale overlay is left behind.
    closeModal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty — run exactly once on mount.

  // Render nothing: the modal wrapper provided by AuthFlowManager gives the
  // visual container; we just need this component to trigger navigation.
  return null;
};

export default SuccessfulModal;
