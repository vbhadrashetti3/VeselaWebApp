"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { localStorageUtil } from "./utils/localStorageUtil";
import { TOKEN } from "./constant";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorageUtil.get(TOKEN);

    if (!token) {
      router.replace("/"); // redirect to public page
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) return null; // or loader

  return <>{children}</>;
}
