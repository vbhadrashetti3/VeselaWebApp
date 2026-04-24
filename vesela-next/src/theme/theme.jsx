"use client";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#250514", // Your deep burgundy
    },
    background: {
      default: "#f2fbff", // Soft light blue background
      paper: "#ffffff",
    },
    text: {
      primary: "#101e22",
      secondary: "#504447",
    },
  },
  typography: {
    fontFamily: "Manrope, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },
    button: {
      textTransform: "none", // Keeps buttons from being all caps
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12, // Modern rounded corners
  },
});
