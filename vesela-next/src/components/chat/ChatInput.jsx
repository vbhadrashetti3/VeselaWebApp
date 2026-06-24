"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Container,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { CHAT_CONTAINER_MAX_WIDTH } from "@/constant";

export default function ChatInput({
  onSend,
  isConnected,
  isGuestLocked = false,
}) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ ADD THIS
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isLight = theme.palette.mode === "light";
  const isMultiline =
    inputValue.split("\n").length > 1 || inputValue.length > 60;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pb: { xs: 2, sm: 4 },
        pt: { xs: 1.5, sm: 2 },
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%" }}>
        {/* Main Container */}
        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            flexDirection: isMultiline ? "column" : "row",
            alignItems: isMultiline ? "stretch" : "center",
            borderRadius: isMultiline ? "20px" : "28px",
            border: "1px solid",
            borderColor: isFocused
              ? theme.palette.primary.main
              : theme.palette.sendMsgInput?.sendMsgBorder || theme.palette.divider,
            backgroundColor: theme.palette.sendMsgInput?.sendMsgInputBg || theme.palette.background.default,
            boxShadow: isFocused
              ? `0 0 0 3px ${alpha(theme.palette.primary.main, isLight ? 0.12 : 0.25)}, 0 4px 12px ${isLight ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.2)"}`
              : "none",
            transition:
              "border-color 0.2s, box-shadow 0.2s, border-radius 0.2s",
            padding: isMultiline
              ? "10px 12px 8px 16px"
              : "4px 8px 4px 16px",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            "&:hover": {
              borderColor: isFocused
                ? theme.palette.primary.main
                : theme.palette.custom?.border?.strong || theme.palette.text.secondary,
            },
          }}
        >
          {/* Input */}
          <InputBase
            inputRef={inputRef}
            fullWidth
            multiline
            minRows={1}
            maxRows={6}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isGuestLocked
                ? "Limit reached. Log in or upgrade to continue..."
                : isConnected
                  ? "Send Message ..."
                  : "Connecting..."
            }
            disabled={isGuestLocked}
            sx={{
              color: theme.palette.text.primary,
              // ≥16px prevents iOS Safari from auto-zooming the viewport on focus
              fontSize: { xs: "16px", sm: "16px" },
              lineHeight: 1.5,
              flex: 1,
              minWidth: 0,
              mr: isMultiline ? 0 : 1.5,
              mb: isMultiline ? 1 : 0,
              alignSelf: "center",

              "& textarea": {
                padding: "8px 0",
                margin: 0,
                overflow: "auto !important",
                minHeight: "23px",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },

                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },

                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.divider,
                  borderRadius: "99px",
                },

                "&::-webkit-scrollbar-thumb:hover": {
                  background: theme.palette.text.disabled,
                },

                scrollbarWidth: "thin",

                scrollbarColor: `${theme.palette.divider} transparent`,
              },
            }}
          />

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexShrink: 1,
              minWidth: "fit-content",
              gap: { xs: "6px", sm: "8px" },
              alignSelf: isMultiline ? "flex-end" : "center",
            }}
          >
            {/* Mic */}
            <Tooltip
              title="Voice input is coming soon!"
              arrow
              placement="top"
            >
              <Box
                component="span"
                sx={{ display: "inline-flex" }}
              >
                <IconButton
                  size="small"
                  disabled
                  sx={{
                    color: theme.palette.text.secondary,
                    width: 34,
                    height: 34,
                    backgroundColor: isLight
                      ? "rgba(0, 0, 0, 0.04)"
                      : "rgba(255, 255, 255, 0.05)",
                    pointerEvents: "none",
                  }}
                >
                  <MicNoneOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Tooltip>

            {/* Send */}
            <IconButton
              onClick={handleSend}
              disabled={!isSendEnabled}
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.main,
                color: "#ffffff",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

                "&.Mui-disabled": {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },

                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "scale(1.05)",
                },

                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <SendOutlinedIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
