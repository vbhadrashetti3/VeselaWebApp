"use client";

import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";
import { Box } from "@mui/material";
import { PublicThemeRegistry } from "@/theme/ThemeRegistry";

/**
 * Layout for all public-facing pages.
 * Always rendered in light mode — no dark-mode toggle available.
 */
export default function PublicLayout({ children }) {
  return (
    <PublicThemeRegistry>
      <Box>
        <PublicHeader />
        {children}
        <PublicFooter />
      </Box>
    </PublicThemeRegistry>
  );
}
