"use client";

import React from "react";
import { Box, Container, useTheme } from "@mui/material";
import ChangePasswordContent from "@/components/setting/ChangePasswordContent";
import Header from "@/components/chat/Header";

export default function ChangePasswordPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        pt: 10,
        pb: 6,
        px: 2,
      }}
    >
      <Header />
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: "background.paper",
            p: { xs: 2.5, sm: 4 },
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === "dark"
              ? "0 4px 24px rgba(0,0,0,0.5)"
              : "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <ChangePasswordContent />
        </Box>
      </Container>
    </Box>
  );
}
