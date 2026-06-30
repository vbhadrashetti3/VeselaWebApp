"use client";

import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useFetchHtml } from "@/hooks/useFetchHtml";
import SettingSection from "./SettingSection";

const PrivacyContent = () => {
  const theme = useTheme();

  // Use the custom hook with the specific endpoint
  const { htmlContent, loading, error } = useFetchHtml("/api/privacy/");

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          height: "200px",
          width: "100%",
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error || !htmlContent) {
    return (
      <SettingSection title="Privacy Policy" description="Read our Privacy Policy">
        <Typography color="error" variant="body2">
          {error
            ? "Error loading privacy policy. Please try again later."
            : "No Privacy Policy found."}
        </Typography>
      </SettingSection>
    );
  }

  return (
    <SettingSection title="Privacy Policy" description="Read our Privacy Policy">
      <Box
        sx={{
          width: "100%",
          color: theme.palette.text.primary,
          // Match standard document styling to your MUI theme
          "& h1, & h2, & h3": {
            color: theme.palette.text.primary,
            fontWeight: 600,
            mt: 3,
            mb: 2,
          },
          "& p": {
            lineHeight: 1.7,
            mb: 2,
            color: theme.palette.text.secondary,
            fontSize: "0.9rem",
          },
          "& ul, & ol": { mb: 2, pl: 3, color: theme.palette.text.secondary },
          "& li": { mb: 1 },
          "& a": {
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Box>
    </SettingSection>
  );
};

export default PrivacyContent;
