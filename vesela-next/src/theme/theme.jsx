"use client";

import { createTheme, alpha } from "@mui/material/styles";

// ─────────────────────────────────────────────
// 1.  SOURCE-OF-TRUTH BRAND CONSTANTS
// ─────────────────────────────────────────────

/** Primary brand color */
const BRAND_PRIMARY = "#286CA8";

const colorTokens = {
  light: {
    brand: {
      main: BRAND_PRIMARY,
      light: "#4c87bb",
      dark: "#1f5b8d",
      contrastText: "#ffffff",
    },
    primary: {
      main: BRAND_PRIMARY,
      dark: "#1f5b8d",
      light: "#4c87bb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E0E0E0",
      dark: "#b0b0b0",
      light: "#f0f0f0",
      contrastText: "#000000",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
      disabled: "#9e9e9e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
      overlay: "#ffffff",
    },
    surface: {
      surface: "#ffffff",
      surfaceElevated: "#ffffff",
      surfaceHover: "#f5f5f5",
      modal: "#ffffff",
      sidebar: "#f5f5f5",
      card: "#ffffff",
    },
    border: {
      soft: "#E0E0E0",
      strong: "#cccccc",
    },
    divider: "#E0E0E0",
    state: {
      hover: "rgba(40, 108, 168, 0.04)",
      selected: "rgba(40, 108, 168, 0.10)",
      focusRing: "rgba(40, 108, 168, 0.25)",
      disabledBg: "#e0e0e0",
    },
    header: {
      background: "#ffffff",
      border: "#E0E0E0",
    },
    chat: {
      userBubble: "#E0E0E0",
      assistantBubble: "#ffffff",
      bubbleBorder: "#E0E0E0",
      inputBg: "#FAFAFA",
      welcomeBg: "#FAFAFA",
      welcomeText: "#9E9E9E",
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
      shadow: "0 10px 24px rgba(0, 0, 0, 0.04)",
      modalShadow: "0 20px 52px rgba(0, 0, 0, 0.12)",
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
      main: BRAND_PRIMARY,
      light: "#4c87bb",
      dark: "#1f5b8d",
      contrastText: "#ffffff",
    },
    primary: {
      main: BRAND_PRIMARY,
      dark: "#1f5b8d",
      light: "#4c87bb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#35383F",
      dark: "#1c1e22",
      light: "#4e525c",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
      disabled: "#777777",
    },
    background: {
      default: "#000000",
      paper: "#1e1e1e",
      overlay: "#1e1e1e",
    },
    surface: {
      surface: "#1e1e1e",
      surfaceElevated: "#1e1e1e",
      surfaceHover: "#2a2a2a",
      modal: "#1F222A",
      sidebar: "#1F222A",
      card: "#1e1e1e",
    },
    border: {
      soft: "#35383F",
      strong: "#4e525c",
    },
    divider: "#35383F",
    state: {
      hover: "rgba(40, 108, 168, 0.06)",
      selected: "rgba(40, 108, 168, 0.25)",
      focusRing: "rgba(40, 108, 168, 0.40)",
      disabledBg: "#424242",
    },
    header: {
      background: "#1e1e1e",
      border: "#35383F",
    },
    chat: {
      userBubble: "#1F222A",
      assistantBubble: "#000000",
      bubbleBorder: "#35383F",
      inputBg: "#161618",
      welcomeBg: "#1F222A",
      welcomeText: "#BDBDBD",
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

const publicColorTokens = colorTokens;
const chatColorTokens = colorTokens;

// ─────────────────────────────────────────────
// 4.  SHARED TYPOGRAPHY
// ─────────────────────────────────────────────

const typography = {
  fontFamily:
    "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  h1: {
    fontFamily: "var(--font-manrope), sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  h2: {
    fontFamily: "var(--font-manrope), sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontFamily: "var(--font-manrope), sans-serif",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontFamily: "var(--font-manrope), sans-serif",
    fontWeight: 700,
  },
  h5: {
    fontFamily: "var(--font-manrope), sans-serif",
    fontWeight: 600,
  },
  h6: {
    fontFamily: "var(--font-manrope), sans-serif",
    fontWeight: 600,
  },
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
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: "none",
        backgroundImage: "none",
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
        borderRadius: 12,
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
      chat: {
        user: t.chat.userBubble,
        bot: t.chat.assistantBubble,
        msgBg: mode === "light" ? "#E0E0E0" : "#35383F",
      },
      welcomePage: {
        background: t.chat.welcomeBg,
        text: t.chat.welcomeText,
        capabilitiesText: mode === "light" ? "#BDBDBD" : "#424242",
      },
      sendMsgInput: {
        sendMsgInputBg: t.chat.inputBg,
        sendMsgBorder: t.border.soft,
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
