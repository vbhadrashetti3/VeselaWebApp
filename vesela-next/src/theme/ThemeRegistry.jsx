"use client";

import { useMemo, useState, useEffect, createContext, useContext } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAppTheme, getChatTheme } from "./theme";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { localStorageUtil } from "@/utils/localStorageUtil";

// ─── Color Mode Context ──────────────────────────────────────────────────────
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

// ─── Shared mode state + toggle logic ────────────────────────────────────────

function useModeState() {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorageUtil.get("theme");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
    setMounted(true);
  }, []);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorageUtil.set("theme", next);
          return next;
        });
      },
    }),
    [mode],
  );

  return { mode, mounted, colorMode };
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT THEME REGISTRY  (used by root layout — wraps everything)
// Uses the public primary brand colour: #3e1929, respects saved mode preference.
// ─────────────────────────────────────────────────────────────────────────────
export default function ThemeRegistry({ children }) {
  const { mode, mounted, colorMode } = useModeState();
  const theme = useMemo(() => getAppTheme(mode), [mode]);

  // Prevent hydration mismatch — keep ThemeProvider so useTheme() always
  // returns the app theme (palette.custom defined) even before mount.
  if (!mounted) {
    return (
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <div style={{ visibility: "hidden" }}>{children}</div>
        </ThemeProvider>
      </AppRouterCacheProvider>
    );
  }

  return (
    <AppRouterCacheProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC WEBSITE THEME REGISTRY
// Always light mode — no toggle exposed.
// Primary brand colour: #3e1929
// ─────────────────────────────────────────────────────────────────────────────

/** Light-mode-only context value — toggle is a no-op. */
const LIGHT_MODE_CONTEXT = {
  mode: "light",
  toggleColorMode: () => {},
};

export function PublicThemeRegistry({ children }) {
  const theme = useMemo(() => getAppTheme("light"), []);

  return (
    <ColorModeContext.Provider value={LIGHT_MODE_CONTEXT}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT APPLICATION THEME REGISTRY
// Uses the chat primary brand colour: #1f222a
// Wrap chat pages with this instead of the default ThemeRegistry.
// ─────────────────────────────────────────────────────────────────────────────
export function ChatThemeRegistry({ children }) {
  const { mode, mounted, colorMode } = useModeState();
  const theme = useMemo(() => getChatTheme(mode), [mode]);

  if (!mounted) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
