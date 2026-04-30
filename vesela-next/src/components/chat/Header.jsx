"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

export default function Header() {
  return (
    <AppBar
      position="fixed" // Changed to fixed
      elevation={0}
      sx={{
        backgroundColor: "#000", // Semi-transparent
        // backdropFilter: "blur(8px)", // Glassmorphism effect
        // borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        // zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="md">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0 !important", // Reduced padding for fixed header
            minHeight: "64px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: "1.1rem", color: "white" }}
            >
              DevAssistant
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
