"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Container,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { CHAT_CONTAINER_MAX_WIDTH } from "@/constant";
import { Mic, Send } from "lucide-react";

export default function ChatInput({
  onSend,
  isConnected,
  isGuestLocked = false,
}) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // ── Hydration-safe placeholder ──────────────────────────────────────────────
  // SSR always renders a fixed string so server and first-client HTML match.
  // After mount we derive the real value from live props (isConnected, etc.).
  const SSR_PLACEHOLDER = "Send Message ...";
  const [placeholder, setPlaceholder] = useState(SSR_PLACEHOLDER);
  useEffect(() => {
    setPlaceholder(
      isGuestLocked
        ? "Limit reached. Log in or upgrade to continue..."
        : isConnected
          ? "Send Message ..."
          : "Connecting..."
    );
  }, [isConnected, isGuestLocked]);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

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

  // Safe fallbacks for theme values to avoid extraction issues
  const sendMsgBorderColor = theme.palette.sendMsgInput?.sendMsgBorder || theme.palette.divider;
  const sendMsgBgColor = theme.palette.sendMsgInput?.sendMsgInputBg || theme.palette.background.default;
  const hoverBorderColor = theme.palette.custom?.border?.strong || theme.palette.text.secondary;

  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pb: { xs: 2, sm: 4 },
        pt: { xs: 1.5, sm: 2 },
        background: theme.palette.mode === "dark"
          ? "linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.88) 70%, rgba(10,10,10,0.0) 100%)"
          : "linear-gradient(to top, rgba(244,243,239,0.97) 0%, rgba(244,243,239,0.88) 70%, rgba(244,243,239,0.0) 100%)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <Container
        maxWidth={false}
        sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%" }}
      >
        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            flexDirection: isMultiline ? "column" : "row",
            alignItems: isMultiline ? "stretch" : "center",
            borderRadius: isMultiline ? "20px" : "28px",
            border: "1px solid",
            borderColor: isFocused ? theme.palette.primary.main : sendMsgBorderColor,
            backgroundColor: sendMsgBgColor,
            boxShadow: isFocused
              ? `0 0 0 3px ${alpha(theme.palette.primary.main, isLight ? 0.12 : 0.25)}, 0 4px 12px ${isLight ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.2)"}`
              : "none",
            transition: "border-color 0.2s, box-shadow 0.2s, border-radius 0.2s",
            padding: isMultiline ? "10px 12px 8px 16px" : "4px 8px 4px 16px",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            "&:hover": {
              borderColor: isFocused ? theme.palette.primary.main : hoverBorderColor,
            },
          }}
        >
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
            placeholder={placeholder}
            disabled={isGuestLocked}
            sx={{
              color: theme.palette.text.primary,
              fontSize: "16px", // Stops mobile browsers from automatically zooming layout
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexShrink: 0,
              minWidth: "fit-content",
              gap: { xs: "6px", sm: "8px" },
              alignSelf: isMultiline ? "flex-end" : "center",
            }}
          >
            <Tooltip
              title="Voice input is coming soon!"
              arrow
              placement="top"
            >
              <Box component="span" sx={{ display: "inline-flex" }}>
                <IconButton
                  size="small"
                  disabled
                  aria-label="Voice input coming soon"
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
                  <Mic size={16} />
                </IconButton>
              </Box>
            </Tooltip>

            <IconButton
              onClick={handleSend}
              disabled={!isSendEnabled}
              aria-label="Send message"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: isSendEnabled
                  ? theme.palette.primary.main
                  : isLight
                    ? "rgba(0, 0, 0, 0.04)"
                    : "rgba(255, 255, 255, 0.06)",
                color: isSendEnabled
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.disabled,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: isSendEnabled
                    ? theme.palette.primary.dark
                    : isLight
                      ? "rgba(0, 0, 0, 0.06)"
                      : "rgba(255, 255, 255, 0.08)",
                  transform: isSendEnabled ? "scale(1.05)" : "none",
                },
                "&:active": {
                  transform: isSendEnabled ? "scale(0.95)" : "none",
                },
              }}
            >
              <Send size={15} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}