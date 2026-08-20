"use client";

import { Box } from "@mui/material";
import { ChatThemeRegistry } from "@/theme/ThemeRegistry";


/**
 * Client shell for authenticated routes. SEO metadata (noindex) lives in layout.jsx.
 */
export default function PrivateLayoutClient({ children }) {
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
