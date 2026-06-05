"use client";

import { useMemo, useState, useEffect, createContext, useContext } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAppTheme } from "./theme"; // ✅ FIXED

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { localStorageUtil } from "@/utils/localStorageUtil";

// Context
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeRegistry({ children }) {
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

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <AppRouterCacheProvider>
        <div style={{ visibility: "hidden" }}>{children}</div>
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
