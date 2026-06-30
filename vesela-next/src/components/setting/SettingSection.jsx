"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Reusable layout wrapper for all Settings Modal sections.
 * Ensures consistent title typography, descriptions, and structural alignment
 * across all pages.
 */
const SettingSection = ({ title, description, children, sx = {} }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        ...sx,
      }}
    >
      {(title || description) && (
        <Box sx={{ mb: 1 }}>
          {title && (
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5, lineHeight: 1.6 }}
            >
              {description}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ width: "100%" }}>{children}</Box>
    </Box>
  );
};

export default SettingSection;
