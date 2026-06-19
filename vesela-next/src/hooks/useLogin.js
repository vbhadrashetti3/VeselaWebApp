"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth.service";
import { MODALS } from "@/components/modals/modalConstants";

export const useLogin = (handleNext, onSuccess) => {
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (values, setSubmitting) => {
    try {
      setErrorMsg("");

      const response = await loginUser(values);

      if (!response.error && response.status === 200) {
        // Persist auth state via context (which also writes localStorage)
        login(response.data.access, response.data.user);

        onSuccess?.();
        handleNext(MODALS.SUCCESS);
      } else {
        setErrorMsg(
          response?.data?.detail ||
            response?.data?.non_field_errors?.[0] ||
            "Login failed",
        );
      }
    } catch {
      setErrorMsg("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    login: handleLogin,
    errorMsg,
    setErrorMsg,
  };
};
