"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ModalHeader = ({ title, subtitle, align = "left", marginBottom = 3 }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: marginBottom, textAlign: align }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default ModalHeader;
