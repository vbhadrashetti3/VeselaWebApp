"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { getTheme } from "../theme/theme"; // Adjust path
import { localStorageUtil } from "@/utils/localStorageUtil";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  // 1. Handle Hydration (Next.js specific)
  useEffect(() => {
    const savedMode = localStorageUtil.get("appMode");
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
    setMounted(true);
  }, []);

  // 2. Toggle Function
  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorageUtil.set("appMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  // Prevent flash of unstyled content during hydration
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
