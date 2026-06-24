"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import { scrollbarStyles } from "@/utils/scrollbar";

// ─── MainContent ───────────────────────────────────────────────────────────────
// Migration changes from VeselaAI:
//   • Matched VeselaAI's padding: pt:6, pr:3, pb:6, pl:3 (was p:{xs:2, md:0})
//   • Added overflowX: "hidden" — prevents horizontal bleed from wide content
//     (e.g. ModelCardContent tables, language chip grid, code blocks)
//   • Kept scrollbarStyles for consistent custom scrollbar across themes
//   • Kept boxSizing: "border-box" (VeselaAI pattern)

const MainContent = ({ renderSection }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        flex: 1,
        // Vertical scroll lives here — sidebar scrolls independently
        overflowY: "auto",
        // Prevent wide content (tables, chip grids) from causing horizontal overflow
        overflowX: "hidden",
        // Matched to VeselaAI — provides breathing room around all section content
        pt: 6,
        pr: 3,
        pb: 6,
        pl: 3,
        boxSizing: "border-box",
        color: "text.primary",
        ...scrollbarStyles(theme),
      }}
    >
      {renderSection()}
    </Box>
  );
};

export default MainContent;
