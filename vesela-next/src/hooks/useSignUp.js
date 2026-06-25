"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import { MODALS } from "@/components/modals/modalConstants";
import { useAuth } from "@/context/AuthContext";

export const useSignUp = (handleNext, onSuccess) => {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const signUp = async (values, setSubmitting) => {
    try {
      setErrorMsg("");
      const response = await registerUser(values);
      if (!response.error && response.status === 201) {
        // Dispatch login state update to context
        login(response.data.access, response.data.user);

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
