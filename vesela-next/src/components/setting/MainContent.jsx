"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import { scrollbarStyles } from "@/utils/scrollbar";

// ─── MainContent ───────────────────────────────────────────────────────────────


const MainContent = ({ renderSection }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        height: "calc(100% - 50px)",
        mt: "50px",
        width: "100%",
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
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
