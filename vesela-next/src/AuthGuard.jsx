"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// ─── Minimal full-screen loader ───────────────────────────────────────────────
// Shown only while the session check is in-flight. Matches the dark app shell
// so there is zero visible color change when the real content renders.
function AuthCheckLoader() {
  return (
    <div
      aria-label="Loading…"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.12)",
          borderTopColor: "rgba(255,255,255,0.72)",
          animation: "vesela-spin 0.75s linear infinite",
        }}
      />
      <style>{`
        @keyframes vesela-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── AuthGuard ────────────────────────────────────────────────────────────────

/**
 * Wraps all private (authenticated) routes.
 *
 * States:
 *   !isSessionChecked            → show AuthCheckLoader (never blank-flash)
 *   isSessionChecked && !auth    → redirect to "/" (let ClientRedirect handle marketing page)
 *   isSessionChecked && auth     → render children
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isSessionChecked } = useAuth();

  useEffect(() => {
    if (isSessionChecked && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isSessionChecked, router]);

  // Session check still in progress — show a silent loader, never a blank screen.
  if (!isSessionChecked) return <AuthCheckLoader />;

  // Session confirmed unauthenticated — redirect is in flight, keep loader visible.
  if (!isAuthenticated) return <AuthCheckLoader />;

  return <>{children}</>;
}
