"use client";

import { createTheme, alpha } from "@mui/material/styles";

// ─────────────────────────────────────────────
// 1.  SOURCE-OF-TRUTH BRAND CONSTANTS
// ─────────────────────────────────────────────

/** Public website accent/brand color */
const PUBLIC_PRIMARY = "#3e1929";

/** Chat application background / brand color */
const CHAT_PRIMARY = "#1f222a";

const SECONDARY_LIGHT = "#286CA8";
const SECONDARY_DARK = "#5a90c0";

// ─────────────────────────────────────────────
// 2.  PUBLIC WEBSITE COLOR TOKENS
// ─────────────────────────────────────────────

/**
 * Semantic design tokens for the Public Website.
 * Primary brand: #3e1929 (deep burgundy/maroon)
 */
const publicColorTokens = {
  light: {
    brand: {
      main: PUBLIC_PRIMARY,
      light: "#5e2b42",
      dark: "#2d111d",
      contrastText: "#ffffff",
    },
    primary: {
      main: PUBLIC_PRIMARY,
      dark: "#2d111d",
      light: "#5e2b42",
      contrastText: "#ffffff",
    },
    secondary: {
      main: SECONDARY_LIGHT,
      dark: "#1f5b8d",
      light: "#4c87bb",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      disabled: "#94a3b8",
    },
    background: {
      default: "#f6f8fc",
      paper: "#ffffff",
      overlay: "#ffffff",
    },
    surface: {
      surface: "#ffffff",
      surfaceElevated: "#ffffff",
      surfaceHover: "#f8fafc",
      modal: "#ffffff",
      sidebar: "#f8fafd",
      card: "#ffffff",
    },
    border: {
      soft: "#e2e8f0",
      strong: "#cbd5e1",
    },
    divider: "#e2e8f0",
    state: {
      hover: "rgba(15, 23, 42, 0.04)",
      selected: "rgba(62, 25, 41, 0.10)",
      focusRing: "rgba(62, 25, 41, 0.28)",
      disabledBg: "#e2e8f0",
    },
    header: {
      background: "rgba(255, 255, 255, 0.88)",
      border: "rgba(15, 23, 42, 0.08)",
    },
    chat: {
      userBubble: "#f4ebf0",
      assistantBubble: "#ffffff",
      bubbleBorder: "#ecdbe4",
      inputBg: "#ffffff",
      welcomeBg: "#f6edf2",
      welcomeText: "#7a5c6b",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#047857",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#b45309",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    shadows: {
      shadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
      modalShadow: "0 20px 52px rgba(15, 23, 42, 0.18)",
    },
    radius: {
      small: "6px",
      medium: "12px",
      large: "18px",
      full: "9999px",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
  },
  dark: {
    brand: {
      main: PUBLIC_PRIMARY,
      light: "#5e2b42",
      dark: "#2d111d",
      contrastText: "#ffffff",
    },
    primary: {
      main: "#d896b0",
      dark: "#a65c7c",
      light: "#e6b3c7",
      contrastText: "#151c25",
    },
    secondary: {
      main: SECONDARY_DARK,
      dark: "#1f5b8d",
      light: "#82aed4",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#e5edf6",
      secondary: "#a3b3c5",
      disabled: "#6e8096",
    },
    background: {
      default: "#fff",
      paper: "#151c25",
      overlay: "#1a222d",
    },
    surface: {
      surface: "#151c25",
      surfaceElevated: "#1b2430",
      surfaceHover: "#222e3d",
      modal: "#202a36",
      sidebar: "#131a23",
      card: "#1b2430",
    },
    border: {
      soft: "#2a3645",
      strong: "#3a4758",
    },
    divider: "#2a3645",
    state: {
      hover: "rgba(229, 237, 246, 0.06)",
      selected: "rgba(216, 150, 176, 0.24)",
      focusRing: "rgba(216, 150, 176, 0.42)",
      disabledBg: "#2a3645",
    },
    header: {
      background: "rgba(15, 20, 27, 0.84)",
      border: "rgba(229, 237, 246, 0.10)",
    },
    chat: {
      userBubble: "#4a2336",
      assistantBubble: "#18212b",
      bubbleBorder: "#422835",
      inputBg: "#121923",
      welcomeBg: "#2b1a23",
      welcomeText: "#c8a5b7",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#047857",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#b45309",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    shadows: {
      shadow: "0 14px 40px rgba(0, 0, 0, 0.40)",
      modalShadow: "0 22px 56px rgba(0, 0, 0, 0.46)",
    },
    radius: {
      small: "6px",
      medium: "12px",
      large: "18px",
      full: "9999px",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
  },
};

// ─────────────────────────────────────────────
// 3.  CHAT APPLICATION COLOR TOKENS
// ─────────────────────────────────────────────

/**
 * Semantic design tokens for the Chat Application.
 * Primary brand: #1f222a (dark charcoal/navy)
 *
 * In light mode the AppBar / interactive elements use this dark tone.
 * In dark mode, surface colours sit on top of this deep background.
 */
const chatColorTokens = {
  light: {
    brand: {
      main: CHAT_PRIMARY,
      light: "#2e3240",
      dark: "#14161c",
      contrastText: "#ffffff",
    },
    primary: {
      main: CHAT_PRIMARY,
      dark: "#14161c",
      light: "#2e3240",
      contrastText: "#ffffff",
    },
    secondary: {
      main: SECONDARY_LIGHT,
      dark: "#1f5b8d",
      light: "#4c87bb",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      disabled: "#94a3b8",
    },
    background: {
      default: "#f4f6fa",
      paper: "#ffffff",
      overlay: "#ffffff",
    },
    surface: {
      surface: "#ffffff",
      surfaceElevated: "#f8fafc",
      surfaceHover: "#f1f5f9",
      modal: "#ffffff",
      sidebar: "#f4f6fa",
      card: "#ffffff",
    },
    border: {
      soft: "#e2e8f0",
      strong: "#cbd5e1",
    },
    divider: "#e2e8f0",
    state: {
      hover: "rgba(31, 34, 42, 0.06)",
      selected: "rgba(31, 34, 42, 0.12)",
      focusRing: "rgba(31, 34, 42, 0.28)",
      disabledBg: "#e2e8f0",
    },
    header: {
      background: CHAT_PRIMARY,
      border: "rgba(255, 255, 255, 0.10)",
    },
    chat: {
      userBubble: "#e8eaf0",
      assistantBubble: "#ffffff",
      bubbleBorder: "#d8dce8",
      inputBg: "#ffffff",
      welcomeBg: "#eef0f6",
      welcomeText: "#4a5068",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#047857",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#b45309",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    shadows: {
      shadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
      modalShadow: "0 20px 52px rgba(15, 23, 42, 0.18)",
    },
    radius: {
      small: "6px",
      medium: "12px",
      large: "18px",
      full: "9999px",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
  },
  dark: {
    brand: {
      main: CHAT_PRIMARY,
      light: "#2e3240",
      dark: "#14161c",
      contrastText: "#ffffff",
    },
    primary: {
      // In dark mode, use a lighter accent derived from the chat primary
      main: "#8b93b0",
      dark: "#5c6280",
      light: "#b0b8d4",
      contrastText: "#0f111a",
    },
    secondary: {
      main: SECONDARY_DARK,
      dark: "#1f5b8d",
      light: "#82aed4",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#e4e8f4",
      secondary: "#9ba3be",
      disabled: "#5c6480",
    },
    background: {
      default: "#000000",
      paper: CHAT_PRIMARY,
      overlay: CHAT_PRIMARY,
    },
    surface: {
      surface: CHAT_PRIMARY,
      surfaceElevated: CHAT_PRIMARY,
      surfaceHover: "#2e3345",
      modal: CHAT_PRIMARY,
      sidebar: CHAT_PRIMARY,
      card: CHAT_PRIMARY,
    },
    border: {
      soft: "#303545",
      strong: "#404660",
    },
    divider: "#303545",
    state: {
      hover: "rgba(228, 232, 244, 0.06)",
      selected: "rgba(139, 147, 176, 0.20)",
      focusRing: "rgba(139, 147, 176, 0.40)",
      disabledBg: "#303545",
    },
    header: {
      background: "#000000",
      border: "rgba(228, 232, 244, 0.10)",
    },
    chat: {
      userBubble: "#2e3345",
      assistantBubble: CHAT_PRIMARY,
      bubbleBorder: "#303545",
      inputBg: "#191c26",
      welcomeBg: CHAT_PRIMARY,
      welcomeText: "#9ba3be",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#047857",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#b45309",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    shadows: {
      shadow: "0 14px 40px rgba(0, 0, 0, 0.50)",
      modalShadow: "0 22px 56px rgba(0, 0, 0, 0.56)",
    },
    radius: {
      small: "6px",
      medium: "12px",
      large: "18px",
      full: "9999px",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
    },
  },
};

// ─────────────────────────────────────────────
// 4.  SHARED TYPOGRAPHY
// ─────────────────────────────────────────────

const typography = {
  fontFamily:
    "var(--font-urbanist), Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  h1: { fontWeight: 700, letterSpacing: "-0.02em" },
  h2: { fontWeight: 700, letterSpacing: "-0.02em" },
  h3: { fontWeight: 650, letterSpacing: "-0.01em" },
  h4: { fontWeight: 650 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 600 },
  subtitle2: { fontWeight: 500 },
  body1: { lineHeight: 1.6 },
  body2: { lineHeight: 1.55 },
  button: {
    textTransform: "none",
    fontWeight: 600,
    letterSpacing: "0.01em",
  },
};

// ─────────────────────────────────────────────
// 5.  SHARED COMPONENT OVERRIDES FACTORY
// ─────────────────────────────────────────────

/**
 * Returns MUI component overrides that work for any token set.
 * All colour references use theme.palette.* — never raw hex values.
 */
const buildComponents = () => ({
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        border: `1px solid ${theme.palette.custom.border.soft}`,
        backgroundColor: theme.palette.custom.surface.surface,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom.surface.card,
        border: `1px solid ${theme.palette.custom.border.soft}`,
        boxShadow: "none",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          borderColor: theme.palette.custom.border.strong,
          backgroundColor: theme.palette.custom.surface.surfaceHover,
        },
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.modalBackground,
        border: `1px solid ${theme.palette.custom.border.soft}`,
        borderRadius: 2,
        boxShadow: theme.palette.custom.modalShadow,
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.custom.surface.sidebar,
        borderColor: theme.palette.custom.border.soft,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.custom.surface.surfaceElevated,
        border: `1px solid ${theme.palette.custom.border.soft}`,
        boxShadow: theme.palette.custom.shadow,
      }),
      list: ({ theme }) => ({
        ".MuiMenuItem-root": {
          borderRadius: 8,
          margin: "2px 6px",
          "&:hover": { backgroundColor: theme.palette.action.hover },
        },
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        paddingInline: 14,
        "&.Mui-disabled": {
          color: theme.palette.text.disabled,
        },
      }),
      containedPrimary: ({ theme }) => ({
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: theme.palette.custom.border.strong,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "small",
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom.chat.inputBg,
        borderRadius: 10,
        transition: "all 0.2s ease",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.custom.border.soft,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.custom.border.strong,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 1.5,
        },
        "&.Mui-disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
        },
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-disabled": {
          color: theme.palette.text.disabled,
        },
      }),
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.palette.custom.surface.surfaceElevated,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.custom.border.soft}`,
        boxShadow: theme.palette.custom.shadow,
        fontSize: "0.75rem",
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.custom.surface.surfaceElevated,
      }),
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.palette.custom.border.soft}`,
        borderRadius: 12,
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.mode === "dark" ? 0.18 : 0.08,
        ),
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
      head: ({ theme }) => ({
        color: theme.palette.text.secondary,
        fontWeight: 600,
      }),
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom.surface.surfaceElevated,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.custom.border.soft}`,
        boxShadow: theme.palette.custom.shadow,
      }),
    },
  },
});

// ─────────────────────────────────────────────
// 6.  THEME FACTORY  (shared palette builder)
// ─────────────────────────────────────────────

const buildTheme = (t, mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: t.primary.main,
        dark: t.primary.dark,
        light: t.primary.light,
        contrastText: t.primary.contrastText,
      },
      secondary: {
        main: t.secondary.main,
        dark: t.secondary.dark,
        light: t.secondary.light,
        contrastText: t.secondary.contrastText,
      },
      background: {
        default: t.background.default,
        paper: t.background.paper,
        modalBackground: t.surface.modal,
      },
      text: {
        primary: t.text.primary,
        secondary: t.text.secondary,
        disabled: t.text.disabled,
      },
      divider: t.border.soft,
      action: {
        hover: t.state.hover,
        selected: t.state.selected,
        focus: t.state.focusRing,
        disabled: t.text.disabled,
        disabledBackground: t.state.disabledBg,
      },
      custom: {
        brand: t.brand,
        primary: t.primary,
        secondary: t.secondary,
        background: t.background,
        surface: t.surface,
        text: t.text,
        border: t.border,
        divider: t.divider,
        success: t.success,
        warning: t.warning,
        error: t.error,
        info: t.info,
        shadows: t.shadows,
        radius: t.radius,
        spacing: t.spacing,
        state: t.state,

        // Backward-compatibility aliases
        header: t.header,
        chat: t.chat,
        shadow: t.shadows.shadow,
        modalShadow: t.shadows.modalShadow,
      },
    },
    shape: { borderRadius: 12 },
    typography,
    components: buildComponents(),
  });

// ─────────────────────────────────────────────
// 7.  PUBLIC EXPORTS
// ─────────────────────────────────────────────

/**
 * Theme for the public-facing website.
 * Primary brand colour: #3e1929
 */
export const getAppTheme = (mode = "light") => {
  const t = publicColorTokens[mode];
  return buildTheme(t, mode);
};

/**
 * Theme for the chat application.
 * Primary brand colour: #1f222a
 */
export const getChatTheme = (mode = "light") => {
  const t = chatColorTokens[mode];
  return buildTheme(t, mode);
};
