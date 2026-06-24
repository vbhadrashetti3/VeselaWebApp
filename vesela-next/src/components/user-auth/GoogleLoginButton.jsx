"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    let active = true;

    const initializeGis = () => {
      if (!window.google || !containerRef.current || !active) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(containerRef.current, {
          theme: isLight ? "outline" : "filled_black",
          size: "large",
          text: "continue_with",
          shape: "circle",
          width: 320, // Responsive premium width
        });
      } catch (err) {
        console.error("Failed to initialize Google Sign-In:", err);
      }
    };

    if (window.google) {
      initializeGis();
    } else {
      // Poll until the GIS library script is fully loaded and interactive
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
  }, [isLight, clientId]);

  const handleCredentialResponse = async (response) => {
    if (!response.credential) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // Send token to proxy path which redirects to https://portal.grayskyai.com/api/auth/google/
      const apiResponse = await post("/api/auth/google/", {
        id_token: response.credential,
      });

      if (!apiResponse.error && apiResponse.status === 200) {
        // Resolve platform token and user info across standard django auth keys
        const token =
          apiResponse.data.access ||
          apiResponse.data.token ||
          apiResponse.data.access_token ||
          apiResponse.data.key;

        const user = apiResponse.data.user;

        if (token && user) {
          login(token, user);
          setDarkMode?.();
          handleNext(MODALS.SUCCESS);
        } else {
          setErrorMsg("Platform token or user details not received from server.");
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
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        mt: 1.5,
        gap: 1,
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <CircularProgress size={20} thickness={4} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Signing in with Google...
          </Typography>
        </Box>
      ) : (
        <div ref={containerRef} style={{ minHeight: "44px" }} />
      )}

      {errorMsg && (
        <Typography
          variant="caption"
          sx={{ color: "error.main", mt: 0.5, textAlign: "center", maxWidth: "320px" }}
        >
          {errorMsg}
        </Typography>
      )}
    </Box>
  );
}
