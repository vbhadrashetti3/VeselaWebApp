"use client";

import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useFetchHtml } from "@/hooks/useFetchHtml";
import SettingSection from "./SettingSection";

const TermsContent = () => {
  const theme = useTheme();

  // Reuse the same hook logic but point to the terms endpoint
  const { htmlContent, loading, error } = useFetchHtml("/api/terms/");

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          width: "100%",
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error || !htmlContent) {
    return (
      <SettingSection title="Terms of Use" description="Read our Terms of Service">
        <Typography color="text.secondary">
          {error
            ? "Failed to load Terms and Conditions."
            : "No Terms and Conditions found."}
        </Typography>
      </SettingSection>
    );
  }

  return (
    <SettingSection title="Terms of Use" description="Read our Terms of Service">
      <Box
        sx={{
          width: "100%",
          color: theme.palette.text.primary,
          // Standardized document styling
          "& h1, & h2, & h3": {
            color: theme.palette.primary.main,
            fontWeight: 600,
            mt: 3,
            mb: 2,
          },
          "& p": {
            lineHeight: 1.8,
            mb: 2,
            color: theme.palette.text.secondary,
            fontSize: "0.95rem",
          },
          "& strong": {
            color: theme.palette.text.primary,
          },
          "& ul, & ol": {
            mb: 2,
            pl: 4,
            color: theme.palette.text.secondary,
          },
          "& li": {
            mb: 1,
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Box>
    </SettingSection>
  );
};

export default TermsContent;
