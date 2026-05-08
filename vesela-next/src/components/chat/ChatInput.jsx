"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Container,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export default function ChatInput({
  onSend,
  isConnected,
  isGuestLocked = false,
}) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);

  // ✅ ADD THIS
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚨 IMPORTANT FIX
  if (!mounted) return null;

  const isSendEnabled =
    inputValue.trim().length > 0 && isConnected && !isGuestLocked;

  const handleSend = () => {
    if (!isSendEnabled) return;

    onSend(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pb: 4,
        pt: 2,
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="md">
        <OutlinedInput
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGuestLocked}
          multiline
          maxRows={6}
          placeholder={isConnected ? "Send Message ..." : "Connecting..."}
          endAdornment={
            <InputAdornment position="end">
              {/* Mic Button */}
              <Tooltip
                title="Voice input coming in the next release"
                arrow
                placement="top"
              >
                <Box component="span">
                  <IconButton
                    disabled
                    sx={{
                      bgcolor: theme.palette.action.disabledBackground,
                      width: 40,
                      height: 40,
                      ml: 1,
                      "&.Mui-disabled": {
                        bgcolor: theme.palette.action.disabledBackground,
                        opacity: 0.5,
                        color: theme.palette.text.disabled,
                      },
                    }}
                  >
                    <MicNoneOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Tooltip>

              {/* Send Button */}
              <IconButton
                onClick={handleSend}
                disabled={!isSendEnabled}
                sx={{
                  bgcolor: isSendEnabled
                    ? theme.palette.primary.main
                    : theme.palette.action.disabledBackground,
                  width: 40,
                  height: 40,
                  ml: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: isSendEnabled
                      ? alpha(theme.palette.primary.main, 0.92)
                      : theme.palette.action.hover,
                  },
                  "&.Mui-disabled": {
                    bgcolor: theme.palette.action.disabledBackground,
                    opacity: 0.6,
                  },
                }}
              >
                <SendOutlinedIcon
                  sx={{
                    color: isSendEnabled
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.disabled,
                    fontSize: 18,
                  }}
                />
              </IconButton>
            </InputAdornment>
          }
          sx={{
            borderRadius: "15px",
            minHeight: 60,
            bgcolor: "background.paper",
          }}
        />
      </Container>
    </Box>
  );
}
