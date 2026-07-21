"use client";

import { createTheme, alpha } from "@mui/material/styles";

// ─────────────────────────────────────────────
// 1.  SOURCE-OF-TRUTH BRAND CONSTANTS
// ─────────────────────────────────────────────

/** Primary brand color */
const BRAND_PRIMARY = "#176f9c";
const BRAND_PRIMARY_DARK = "#60b7e5";

const colorTokens = {
  light: {
    brand: {
      main: BRAND_PRIMARY,
      light: "#b9dbeb",
      dark: "#101113",
      contrastText: "#ffffff",
    },
    primary: {
      main: "#101113",
      dark: "#000000",
      light: "#66686d",
      contrastText: "#f4f3ef",
    },
    secondary: {
      main: "#ebe9e3",
      dark: "#66686d",
      light: "#faf9f6",
      contrastText: "#101113",
    },
    text: {
      primary: "#101113",
      secondary: "#66686d",
      disabled: "rgba(16, 17, 19, 0.38)",
    },
    background: {
      default: "#f4f3ef",
      paper: "#faf9f6",
      overlay: "#faf9f6",
    },
    surface: {
      surface: "#faf9f6",
      surfaceElevated: "#faf9f6",
      surfaceHover: "#ebe9e3",
      modal: "#ebe9e3",
      sidebar: "#ebe9e3",
      card: "#faf9f6",
    },
    border: {
      soft: "rgba(16, 17, 19, 0.16)",
      strong: "rgba(16, 17, 19, 0.34)",
    },
    divider: "rgba(16, 17, 19, 0.16)",
    state: {
      hover: "rgba(23, 111, 156, 0.04)",
      selected: "rgba(23, 111, 156, 0.10)",
      focusRing: "rgba(23, 111, 156, 0.25)",
      disabledBg: "#e0e0e0",
    },
    header: {
      background: "#f4f3ef",
      border: "rgba(16, 17, 19, 0.16)",
    },
    chat: {
      userBubble: "rgba(16, 17, 19, 0.10)",
      assistantBubble: "transparent",
      bubbleBorder: "rgba(16, 17, 19, 0.16)",
      inputBg: "#ebe9e3",
      welcomeBg: "#ebe9e3",
      welcomeText: "#66686d",
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
      shadow: "none",
      modalShadow: "none",
    },
    radius: {
      small: "8px",
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
      main: BRAND_PRIMARY_DARK,
      light: "#153b50",
      dark: "#f7f7f3",
      contrastText: "#0a0a0a",
    },
    primary: {
      main: "#f7f7f3",
      dark: "#ffffff",
      light: "#9a9da3",
      contrastText: "#0a0a0a",
    },
    secondary: {
      main: "#121315",
      dark: "#9a9da3",
      light: "#17181a",
      contrastText: "#f7f7f3",
    },
    text: {
      primary: "#f7f7f3",
      secondary: "#9a9da3",
      disabled: "rgba(255, 255, 255, 0.38)",
    },
    background: {
      default: "#0a0a0a",
      paper: "#17181a",
      overlay: "#17181a",
    },
    surface: {
      surface: "#17181a",
      surfaceElevated: "#17181a",
      surfaceHover: "#121315",
      modal: "#121315",
      sidebar: "#121315",
      card: "#17181a",
    },
    border: {
      soft: "rgba(255, 255, 255, 0.13)",
      strong: "rgba(255, 255, 255, 0.32)",
    },
    divider: "rgba(255, 255, 255, 0.13)",
    state: {
      hover: "rgba(96, 183, 229, 0.06)",
      selected: "rgba(96, 183, 229, 0.25)",
      focusRing: "rgba(96, 183, 229, 0.40)",
      disabledBg: "#424242",
    },
    header: {
      background: "#0a0a0a",
      border: "rgba(255, 255, 255, 0.13)",
    },
    chat: {
      userBubble: "rgba(255, 255, 255, 0.10)",
      assistantBubble: "transparent",
      bubbleBorder: "rgba(255, 255, 255, 0.13)",
      inputBg: "#121315",
      welcomeBg: "#121315",
      welcomeText: "#9a9da3",
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
      shadow: "none",
      modalShadow: "none",
    },
    radius: {
      small: "8px",
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
    fontFamily: "var(--font-inter), sans-serif",
    fontWeight: 400,
    letterSpacing: "-0.03em",
  },
  h2: {
    fontFamily: "var(--font-inter), sans-serif",
    fontWeight: 400,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontFamily: "var(--font-inter), sans-serif",
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontFamily: "var(--font-inter), sans-serif",
    fontWeight: 500,
  },
  h5: {
    fontFamily: "var(--font-inter), sans-serif",
    fontWeight: 500,
  },
  h6: {
    fontFamily: "var(--font-inter), sans-serif",
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
        backgroundColor: theme.palette.background.default,
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
        borderRadius: 9999, // Pill shape
        paddingInline: 18,
        paddingBlock: 6,
        textTransform: "none",
        fontFamily: "var(--font-inter), sans-serif",
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
        borderRadius: 8, // 8px radius
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.custom.border.soft,
          borderWidth: "1px !important",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.custom.border.strong,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: "1px !important",
        },
        "&.Mui-disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
        },
        "& .MuiOutlinedInput-input:-webkit-autofill, & .MuiOutlinedInput-input:-webkit-autofill:hover, & .MuiOutlinedInput-input:-webkit-autofill:focus, & .MuiOutlinedInput-input:-webkit-autofill:active": {
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.modalBackground || theme.palette.background.paper} inset !important`,
          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
          caretColor: `${theme.palette.text.primary} !important`,
          borderRadius: "inherit",
          transition: "background-color 5000s ease-in-out 0s",
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
