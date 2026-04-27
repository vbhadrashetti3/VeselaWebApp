"use client";
import { createTheme } from "@mui/material/styles";

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

const common = {
  typography: {
    fontFamily: "var(--font-urbanist), sans-serif", // ✅ FIXED HERE

    h1: {
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },

    button: {
      textTransform: "none",
    },
  },
};

export const getTheme = (mode = "light") => {
  return createTheme({
    ...common,
    ...themes[mode],
  });
};
