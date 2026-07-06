"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ClientRedirect() {
  const { isAuthenticated, isSessionChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSessionChecked && isAuthenticated) {
      router.replace("/chat");
    }
  }, [isAuthenticated, isSessionChecked, router]);

  return null;
}
