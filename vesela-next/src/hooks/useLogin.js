"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { MODALS } from "@/components/modals/modalConstants";
import { TOKEN, USER_DETAILS, POST_LOGIN_NAVIGATE_TO } from "@/constant";

export const useLogin = (handleNext) => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const login = async (values, setSubmitting) => {
    try {
      setErrorMsg("");

      const response = await loginUser(values);

      if (!response.error && response.status === 200) {
        localStorage.setItem(TOKEN, response.data.access);
        localStorage.setItem(USER_DETAILS, JSON.stringify(response.data.user));

        handleNext(MODALS.SUCCESS_MODAL, "Login Successful!");

        const redirectTo = localStorage.getItem(POST_LOGIN_NAVIGATE_TO);
        if (redirectTo) router.push(redirectTo);
      } else {
        setErrorMsg(
          response?.data?.detail ||
            response?.data?.non_field_errors?.[0] ||
            "Login failed",
        );
      }
    } catch (err) {
      setErrorMsg("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    login,
    errorMsg,
    setErrorMsg,
  };
};
