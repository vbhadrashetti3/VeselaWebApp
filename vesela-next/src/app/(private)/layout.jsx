"use client";

import { Box, useTheme } from "@mui/material";

export default function PrivateLayout({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {children}
    </Box>
  );
}
