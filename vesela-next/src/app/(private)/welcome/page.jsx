"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  InputBase,
  IconButton,
  useTheme,
} from "@mui/material";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useColorMode } from "@/theme/ThemeRegistry";
import { useChatSession } from "@/context/ChatSessionContext";
import GenericLottie from "@/components/ui/GenericLottie";
import Header from "@/components/chat/Header";

import VeselaLogoWhite from "@/../public/vesela_white_lottie.json";
import VeselaLogoBlack from "@/../public/vesela_black_lottie.json";

const WelcomePage = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const router = useRouter();
  const { mode } = useColorMode();
  const { setPendingHeroMessage } = useChatSession();

  const animationData = mode === "dark" ? VeselaLogoWhite : VeselaLogoBlack;

  const isTyping = text.length > 0;
  const isMultiline = text.split("\n").length > 1 || text.length > 60;
  const isSendDisabled = !text.trim();

  const handleSend = useCallback(() => {
    if (!text.trim()) return;

    setPendingHeroMessage(text.trim());
    router.push("/chat");
  }, [text, setPendingHeroMessage, router]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isLight ? "#fff" : "#000",
        color: isLight ? "#000" : "#fff",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <Header />
      {/* ── Logo / Lottie ───────────────────────────────────────────────────── */}
      {animationData && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: isTyping ? 0 : 1, y: isTyping ? -20 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ overflow: "hidden", maxWidth: "100%" }}
        >
          <Box sx={{ mb: 5 }}>
            <GenericLottie
              animationData={animationData}
              width="min(130px, 80vw)"
            />
          </Box>
        </motion.div>
      )}

      <Box
        sx={{
          width: "100%",
          maxWidth: 560,
          px: { xs: 1.5, sm: 2 },
          mb: "10px",
          position: "relative",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* Main container */}
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
              : isLight
                ? "#e5e7eb"
                : "#2d3139",
            backgroundColor: isLight ? "#f9fafb" : "#161618",
            boxShadow: isFocused
              ? isLight
                ? "0 0 0 3px rgba(40, 108, 168, 0.12), 0 4px 12px rgba(0,0,0,0.03)"
                : "0 0 0 3px rgba(40, 108, 168, 0.25), 0 4px 12px rgba(0,0,0,0.2)"
              : "none",
            transition: "border-color 0.2s, box-shadow 0.2s, border-radius 0.2s",
            padding: isMultiline ? "10px 12px 8px 16px" : "4px 8px 4px 16px",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            "&:hover": {
              borderColor: isFocused
                ? theme.palette.primary.main
                : isLight
                  ? "#d1d5db"
                  : "#4b5563",
            },
          }}
        >
          {/* Text input */}
          <InputBase
            inputRef={inputRef}
            fullWidth
            multiline
            minRows={1}
            maxRows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Send Message..."
            sx={{
              color: isLight ? "#111827" : "#f9fafb",
              fontSize: "16px",
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

                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  background: isLight ? "#cbd5e1" : "#3f3f46",
                  borderRadius: "99px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: isLight ? "#94a3b8" : "#52525b",
                },
                scrollbarWidth: "thin",
                scrollbarColor: isLight
                  ? "#cbd5e1 transparent"
                  : "#3f3f46 transparent",
              },
            }}
          />

          {/* Action buttons */}
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
            <IconButton
              onClick={handleSend}
              disabled={isSendDisabled}
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: "#1f5b8d",
                color: "#ffffff",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

                "&:hover": {
                  backgroundColor: "#1f5b8d",
                  transform: isSendDisabled ? "none" : "scale(1.05)",
                },

                "&:active": {
                  transform: isSendDisabled ? "none" : "scale(0.95)",
                },

                "&.Mui-disabled": {
                  backgroundColor: "#1f5b8d",
                  color: "#ffffff",
                  opacity: 0.5,
                },
              }}
            >
              <Send size={15} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomePage;
