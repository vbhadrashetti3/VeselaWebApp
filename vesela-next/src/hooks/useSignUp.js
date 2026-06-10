"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import { MODALS } from "@/components/modals/modalConstants";
import { TOKEN, USER_DETAILS, POST_LOGIN_NAVIGATE_TO } from "@/constant";
import { localStorageUtil } from "@/utils/localStorageUtil";

export const useSignUp = (handleNext, onSuccess) => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const signUp = async (values, setSubmitting) => {
    try {
      setErrorMsg("");
      const response = await registerUser(values);
      if (!response.error && response.status === 201) {
        localStorageUtil.set(TOKEN, response.data.access);
        localStorageUtil.set(USER_DETAILS, JSON.stringify(response.data.user));

        onSuccess && onSuccess();
        handleNext && handleNext(MODALS.UPDATE_INFO);
      } else {
        const backendMsg =
          response?.data?.username?.[0] ||
          response?.data?.password1?.[0] ||
          "Signup failed. Please try again.";
        setErrorMsg(backendMsg);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };
  return {
    signUp,
    errorMsg,
    setErrorMsg,
  };
};
