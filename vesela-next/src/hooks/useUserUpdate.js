"use client";

import { useState } from "react";
import { MODALS } from "@/components/modals/modalConstants";
import { updateUserInfo } from "@/services/update.service";

export const useUserUpdate = (handleNext) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const updateUser = async (values, setSubmitting) => {
    try {
      setErrorMsg("");
      setLoading(true);
      const respones = await updateUserInfo(values);

      if (!respones.error && respones.status === 200) {
         handleNext && handleNext(MODALS.ASSESSMENT_TWO);
      }
    } catch (err) {
      setErrorMsg("Something went wrong");
    } finally { 
      setLoading(false);
    }
  };
  return {
    updateUser,
    errorMsg,
    loading,
    setErrorMsg,
  };
};
