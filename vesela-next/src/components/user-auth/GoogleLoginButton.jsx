"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { post } from "@/lib/apiService";
import { MODALS } from "../modals/modalConstants";

const FALLBACK_CLIENT_ID = "99296678682-10eca36rb47jdoi88gjuuovpg0a49ukc.apps.googleusercontent.com";

export default function GoogleLoginButton({ handleNext, setDarkMode }) {
  const { login } = useAuth();
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || FALLBACK_CLIENT_ID;

  const handleCredentialResponse = useCallback(async (response) => {
    if (!response.credential) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const apiResponse = await post("/api/auth/google/", {
        id_token: response.credential,
      });

      if (!apiResponse.error && apiResponse.status === 200) {
        const user = apiResponse.data.user;
        const accessToken =
          apiResponse.data.access ||
          apiResponse.data.access_token ||
          apiResponse.data.token ||
          apiResponse.data.key ||
          null;

        if (user) {
          login(user, accessToken);
          setDarkMode?.();
          handleNext(MODALS.SUCCESS);
        } else {
          setErrorMsg("User details not received from server.");
        }
      } else {
        setErrorMsg(
          apiResponse?.data?.detail ||
          apiResponse?.data?.non_field_errors?.[0] ||
          "Google Authentication failed.",
        );
      }
    } catch (err) {
      console.error("Google Auth Backend Call Failed:", err);
      setErrorMsg("An unexpected error occurred during platform login.");
    } finally {
      setLoading(false);
    }
  }, [login, setDarkMode, handleNext]);

  useEffect(() => {
    let active = true;

    const initializeGis = () => {
      if (!window.google || !containerRef.current || !active) return;

      try {
        // FIX 1: Clear the container to prevent iframe stacking during hydration/theme toggles
        containerRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(containerRef.current, {
          theme: isLight ? "outline" : "filled_black",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: 320,
        });
      } catch (err) {
        console.error("Failed to initialize Google Sign-In:", err);
      }
    };

    if (window.google) {
      initializeGis();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initializeGis();
        }
      }, 100);

      return () => {
        clearInterval(interval);
        active = false;
      };
    }

    return () => {
      active = false;
    };
  }, [isLight, clientId, handleCredentialResponse]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        mt: 1.5,
        fontFamily: 'Inter, "Inter Fallback", sans-serif',
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "320px",
          height: "44px",
          minHeight: "44px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mx: "auto",
          borderRadius: "22px",
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <Box
            key="loading-box"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              width: "100%",
              height: "44px",
              borderRadius: "22px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              boxSizing: "border-box",
              fontFamily: 'Inter, "Inter Fallback", sans-serif',
            }}
          >
            <CircularProgress size={18} thickness={4} color="inherit" />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: "text.secondary",
                fontSize: "15px",
                fontFamily: 'Inter, "Inter Fallback", sans-serif',
              }}
            >
              Signing in with Google...
            </Typography>
          </Box>
        ) : (
          <Box
            key="google-btn-box"
            ref={containerRef}
            sx={{
              width: "100%",
              height: "44px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // FIX 2: Force transparent backgrounds on the injected elements
              "& > div": {
                backgroundColor: "transparent !important",
              },
              "& iframe": {
                backgroundColor: "transparent !important",
                colorScheme: "normal !important",
              },
            }}
          />
        )}
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: "error.main",
          mt: 0.75,
          textAlign: "center",
          maxWidth: "320px",
          minHeight: "18px",
          lineHeight: "1.3",
          display: "block",
          visibility: errorMsg ? "visible" : "hidden",
          fontFamily: 'Inter, "Inter Fallback", sans-serif',
        }}
      >
        {errorMsg || "\u00A0"}
      </Typography>
    </Box>
  );
}