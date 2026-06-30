"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";  
import { del } from "@/lib/apiService";
import { localStorageUtil } from "@/utils/localStorageUtil";

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const deleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await del("/api/delete/");
      
      // Checking for common success statuses
      if ([200, 204].includes(response?.status)) {
        // Clear user-related local storage (no token to clear — cookies are handled by the backend)
        ["userdetails", "plan_details"].forEach((key) => {
          localStorageUtil.remove(key);
        });

        // Redirect to home and force a reload to clear application state
        router.push("/");
        window.location.reload();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Account deletion error:", err);
      setError(err?.message || "Something went wrong during deletion.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting, error };
};