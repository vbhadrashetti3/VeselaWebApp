"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { post } from "@/lib/apiService";

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async (onSuccess) => {
    setIsLoggingOut(true);
    try {
      const response = await post("/dj-rest-auth/logout/");
      
      // Handle various status codes that imply the session is ended
      const shouldClearAuth = [200, 204, 401, 500].includes(response?.status);

      if (shouldClearAuth) {
        // Clear Authentication items
        localStorage.removeItem("token");
        localStorage.removeItem("postLoginNavigateTo");

        // Reset Object-based items
        const emptyState = JSON.stringify({});
        localStorage.setItem("userdetails", emptyState);
        localStorage.setItem("plan_details", emptyState);

        // Optional callback (e.g., to close the modal)
        if (onSuccess) onSuccess();

        // Redirect to landing page
        router.push("/");
      }
    } catch (error) {
      console.error("Logout process failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};