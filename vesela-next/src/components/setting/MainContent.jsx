"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import { scrollbarStyles } from "@/utils/scrollbar";

const MainContent = ({ renderSection }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        flex: 1, // ✅ fills available height
        overflowY: "auto", // ✅ ONLY scroll here
        p: { xs: 2, md: 0 },
        color: "text.primary",
        ...scrollbarStyles(theme),
        // scrollbar styling
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.divider,
          borderRadius: "10px",
        },
      }}
    >
      {renderSection()}
    </Box>
  );
};

export default MainContent;
