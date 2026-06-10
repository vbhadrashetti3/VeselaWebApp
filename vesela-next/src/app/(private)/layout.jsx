"use client";

import { Box } from "@mui/material";
import { ChatThemeRegistry } from "@/theme/ThemeRegistry";

/**
 * Layout wrapper for all private (authenticated) routes.
 * Applies the Chat Application theme — primary brand: #1f222a.
 */
export default function PrivateLayout({ children }) {
  return (
    <ChatThemeRegistry>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </ChatThemeRegistry>
  );
}
