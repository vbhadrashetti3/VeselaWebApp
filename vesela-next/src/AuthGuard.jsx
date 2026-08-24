"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Guest sales-agent chat lives on /chat (HTTP, not WebSocket). All other
// (private) routes still require a logged-in session.
const GUEST_ALLOWED_PATHS = new Set(["/chat"]);

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
 * Wraps (private) routes.
 *
 * States:
 *   !isSessionChecked                         → AuthCheckLoader (never blank-flash)
 *   isSessionChecked && !auth && !allowGuest  → redirect to "/"
 *   isSessionChecked && (auth || allowGuest)  → render children
 *
 * /chat is allowGuest so the home-page sales agent can continue as HTTP guest chat.
 * /welcome and /change-password stay auth-only.
 */
export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isSessionChecked } = useAuth();
  const allowGuest = GUEST_ALLOWED_PATHS.has(pathname);

  useEffect(() => {
    if (isSessionChecked && !isAuthenticated && !allowGuest) {
      router.replace("/");
    }
  }, [isAuthenticated, isSessionChecked, router, allowGuest]);

  // Session check still in progress — show a silent loader, never a blank screen.
  if (!isSessionChecked) return <AuthCheckLoader />;

  // Session confirmed unauthenticated — redirect is in flight, keep loader visible.
  if (!isAuthenticated && !allowGuest) return <AuthCheckLoader />;

  return <>{children}</>;
}
