"use client";

import { ChatThemeRegistry } from "@/theme/ThemeRegistry";
import Header from "@/components/chat/Header";
import { Box } from "@mui/material";

export default function ShareLayout({ children }) {
  return (
    <ChatThemeRegistry>
      <Box sx={{ minHeight: "100dvh" }}>
        <Header />
        {children}
      </Box>
    </ChatThemeRegistry>
  );
}
