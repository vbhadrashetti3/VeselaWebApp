"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isSessionChecked } = useAuth();

  useEffect(() => {
    if (isSessionChecked && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isSessionChecked, router]);

  // Don't render children until the session check is done and the user is authenticated
  if (!isSessionChecked || !isAuthenticated) return null;

  return <>{children}</>;
}
