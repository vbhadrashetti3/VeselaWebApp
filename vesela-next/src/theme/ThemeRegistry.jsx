"use client";

import { useMemo, useState, useEffect, createContext } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme";

/**
 * 🔹 Context for toggle
 */
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState("light");

  /**
   * 🔹 Load saved theme (optional but recommended)
   */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setMode(saved);
  }, []);

  /**
   * 🔹 Toggle function
   */
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme", next);
          return next;
        });
      },
    }),
    [],
  );

  /**
   * 🔹 Generate theme dynamically
   */
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <AppRouterCacheProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
