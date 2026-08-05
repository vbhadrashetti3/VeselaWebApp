"use client";

import { Box } from "@mui/material";
import { ChatThemeRegistry } from "@/theme/ThemeRegistry";
import AuthGuard from "@/AuthGuard";

/**
 * Layout wrapper for all private (authenticated) routes.
 * Applies the Chat Application theme — primary brand: #1f222a.
 *
 * AuthGuard is applied here so every route in the (private) group
 * is protected with a single declaration. It shows a minimal loader
 * while the session check runs, then redirects to "/" if unauthenticated.
 */
export default function PrivateLayout({ children }) {
  return (
    <ChatThemeRegistry>
      <AuthGuard>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>
      </AuthGuard>
    </ChatThemeRegistry>
  );
}
