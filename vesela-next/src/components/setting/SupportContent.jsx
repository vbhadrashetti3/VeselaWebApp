"use client";

import React from "react";
import { Button, Typography, Box, useTheme } from "@mui/material";
import { ExternalLink } from "lucide-react";
import SettingSection from "./SettingSection";

const SupportContent = () => {
  const theme = useTheme();

  return (
    <SettingSection
      title="Support"
      description="Need help? Our community and support team are available on Discord to assist you with any questions or technical issues."
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.action.hover,
          border: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          width: "100%",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Join our Discord Server
        </Typography>

        <Button
          component="a"
          href="https://discord.com/invite/555T2YcJMM"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<ExternalLink size={18} />}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Open Discord
        </Button>
      </Box>
    </SettingSection>
  );
};

export default SupportContent;
