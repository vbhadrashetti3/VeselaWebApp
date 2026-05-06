"use client";

import { post } from "@/lib/apiService";
import { useState } from "react"; 

export const useAssessment = (onSuccess,onClose) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitAssessment = async (payload) => {
    try {
      setLoading(true);
      setError("");

      const response = await post("/api/store_balgo_info/", payload);

      if (!response.error && response.status === 201) {
        onSuccess && onSuccess(response);
        onClose()
      } else {
        setError("Failed to submit assessment");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAssessment,
    loading,
    error,
  };
};