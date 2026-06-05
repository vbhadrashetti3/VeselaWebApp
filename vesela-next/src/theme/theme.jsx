"use client";

import { createTheme, alpha } from "@mui/material/styles";

const PRIMARY = "#286CA8";
const SECONDARY_LIGHT = "#3a1929";
const SECONDARY_DARK = "#a16c80";

/**
 * Semantic design tokens for scalable theming.
 * These tokens intentionally avoid component-specific naming so they can
 * be reused across pages and future component libraries.
 */
const colorTokens = {
  light: {
    primary: {
      main: PRIMARY,
      dark: "#1f5b8d",
      light: "#4c87bb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: SECONDARY_LIGHT,
      dark: "#2b0b14",
      light: "#6b3a50",
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
      // Required semantic layers for consistent hierarchy.
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
    state: {
      hover: "rgba(15, 23, 42, 0.04)",
      selected: "rgba(40, 108, 168, 0.10)",
      focusRing: "rgba(40, 108, 168, 0.28)",
      disabledBg: "#e2e8f0",
    },
    header: {
      background: "rgba(255, 255, 255, 0.88)",
      border: "rgba(15, 23, 42, 0.08)",
    },
    chat: {
      userBubble: "#dfeefb",
      assistantBubble: "#ffffff",
      bubbleBorder: "#d6e4f2",
      inputBg: "#ffffff",
      welcomeBg: "#edf2f9",
      welcomeText: "#64748b",
    },
    shadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    modalShadow: "0 20px 52px rgba(15, 23, 42, 0.18)",
  },
  dark: {
    primary: {
      main: PRIMARY,
      dark: "#1f5b8d",
      light: "#5a90c0",
      contrastText: "#eaf2f9",
    },
    secondary: {
      main: SECONDARY_DARK,
      dark: "#7a4a60",
      light: "#c490a0",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#e5edf6",
      secondary: "#a3b3c5",
      disabled: "#6e8096",
    },
    background: {
      // Avoid pure-black to keep dark mode premium and reduce eye strain.
      default: "#0f141b",
      paper: "#151c25",
      overlay: "#1a222d",
    },
    surface: {
      // Premium dark layers: soft and separated, not black slabs.
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
    state: {
      hover: "rgba(229, 237, 246, 0.06)",
      selected: "rgba(40, 108, 168, 0.24)",
      focusRing: "rgba(40, 108, 168, 0.42)",
      disabledBg: "#2a3645",
    },
    header: {
      background: "rgba(15, 20, 27, 0.84)",
      border: "rgba(229, 237, 246, 0.10)",
    },
    chat: {
      userBubble: "#223648",
      assistantBubble: "#18212b",
      bubbleBorder: "#304052",
      inputBg: "#121923",
      welcomeBg: "#1a2633",
      welcomeText: "#9fb0c2",
    },
    shadow: "0 14px 40px rgba(0, 0, 0, 0.40)",
    modalShadow: "0 22px 56px rgba(0, 0, 0, 0.46)",
  },
};

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

export const getAppTheme = (mode = "light") => {
  const t = colorTokens[mode];

  return createTheme({
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
        border: t.border,
        header: t.header,
        surface: t.surface,
        chat: t.chat,
        shadow: t.shadow,
        modalShadow: t.modalShadow,
      },
    },
    shape: { borderRadius: 12 },
    typography,
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          "::selection": {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
          },
        }),
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.custom.header.background,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.custom.header.border}`,
            boxShadow: "none",
            backdropFilter: "blur(12px)",
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
    },
  });
};
