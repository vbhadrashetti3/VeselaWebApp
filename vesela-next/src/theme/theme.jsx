"use client";
import { createTheme } from "@mui/material/styles";

/**
 * 🔹 Separate configs (no inline conditions)
 */
const themes = {
  light: {
    palette: {
      mode: "light",
      primary: {
        main: "#3e1929",
      },
      background: {
        default: "#f2fbff",
        paper: "#ffffff",
      },
      text: {
        primary: "#101e22",
        secondary: "#504447",
      },
    },
  },

  dark: {
    palette: {
      mode: "dark",
      primary: {
        main: "#ff8fa3",
      },
      background: {
        default: "#0f172a",
        paper: "#1e293b",
      },
      text: {
        primary: "#f1f5f9",
        secondary: "#94a3b8",
      },
    },
  },
};

/**
 * 🔹 Common config (shared across all themes)
 */
const common = {
  typography: {
    fontFamily: "Manrope, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },
    button: {
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },
};

/**
 * 🔧 Theme factory
 */
export const getTheme = (mode = "light") => {
  return createTheme({
    ...common,
    ...themes[mode],
  });
};
