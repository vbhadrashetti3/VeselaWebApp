"use client";

import { Box } from "@mui/material";
import { ChatThemeRegistry } from "@/theme/ThemeRegistry";
import AuthGuard from "@/AuthGuard";

/**
 * Client shell for authenticated routes. SEO metadata (noindex) lives in layout.jsx.
 */
export default function PrivateLayoutClient({ children }) {
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
