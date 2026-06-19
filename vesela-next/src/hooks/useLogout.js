"use client";

import { useAuth } from "@/context/AuthContext";

export const useLogout = () => {
  const { logout } = useAuth();

  // `logout` from AuthContext already handles API call, storage clear, and redirect.
  // Expose it directly so call-sites are unchanged.
  return { logout, isLoggingOut: false };
};