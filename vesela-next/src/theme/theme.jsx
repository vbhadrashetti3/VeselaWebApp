"use client";

import { createTheme, alpha } from "@mui/material/styles";

const tokens = {
  light: {
    primary: "#286CA8",
    header: {
      background: "rgba(242, 251, 255, 0.99)",
      border: "rgba(0,0,0,0.05)",
      button: "#3e1929",
      buttonHover: "#2d101d",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
      modal: "#fff",
    },
    button: { primary: "#3a0d18" },
    text: {
      primary: "#101e22",
      secondary: "#504447",
    },
    border: "#e0e0e0",
    chat: {
      user: "#E0E0E0",
      bot: "#ffffff",
      msgBg: "#E0E0E0",
    },
    welcome: {
      bg: "#FAFAFA",
      text: "#9E9E9E",
    },
    input: {
      bg: "#FAFAFA",
      border: "#E0E0E0",
    },
  },
  dark: {
    primary: "#286CA8",
    header: {
      background: "rgba(18,18,18,0.92)",
      border: "rgba(255,255,255,0.08)",
      button: "#286CA8",
      buttonHover: "#1f5b8d",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
      modal: "#1F222A",
    },
    button: { primary: "#3a0d18" },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
    border: "#35383F",
    chat: {
      user: "#1F222A",
      bot: "#000000",
      msgBg: "#35383F",
    },
    welcome: {
      bg: "#1F222A",
      text: "#BDBDBD",
    },
    input: {
      bg: "#000000",
      border: "#35383F",
    },
  },
};

export const getAppTheme = (mode = "light") => {
  const t = tokens[mode];

  return createTheme({
    palette: {
      mode,
      primary: { main: t.primary },
      background: {
        default: t.background.default,
        paper: t.background.paper,
        modalBackground: t.background.modal,
      },
      text: {
        primary: t.text.primary,
        secondary: t.text.secondary,
      },
      divider: alpha(t.text.primary, 0.12),
      action: {
        disabled: alpha(t.text.primary, 0.3),
        disabledBackground: mode === "light" ? "#e0e0e0" : "#424242",
      },
      // TYPO FIXED BELOW: Removed the stray 'a' after t.chat
      custom: {
        border: t.border,
        chat: t.chat,
        welcome: t.welcome,
        input: t.input,
        header: t.header,
      },
    },
    typography: {
      fontFamily: "var(--font-urbanist), sans-serif",
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: "none",
          }),
        },
      },
    },
  });
};
