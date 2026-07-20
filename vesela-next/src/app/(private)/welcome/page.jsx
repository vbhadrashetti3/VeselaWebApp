"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, InputBase, IconButton, useTheme } from "@mui/material";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useColorMode } from "@/theme/ThemeRegistry";
import { useChatSession } from "@/context/ChatSessionContext";
import GenericLottie from "@/components/ui/GenericLottie";
import Header from "@/components/chat/Header";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { WELCOME_COMPLETED } from "@/constant";

import VeselaLogoWhite from "@/../public/vesela_white_lottie.json";
import VeselaLogoBlack from "@/../public/vesela_black_lottie.json";

const WelcomePage = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);
  const router = useRouter();
  const { mode } = useColorMode();
  const { setPendingHeroMessage } = useChatSession();

  const animationData = mode === "dark" ? VeselaLogoWhite : VeselaLogoBlack;
  const isTyping = text.length > 0;
  const isSendDisabled = !text.trim();

  // Mark welcome as completed so returning visits go directly to /chat
  useEffect(() => {
    localStorageUtil.set(WELCOME_COMPLETED, true);
  }, []);

  // Auto-focus input on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: isLight ? "#ffffff" : "#000000",
        color: isLight ? "#000000" : "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      {/* ── Top Header / Menu ────────────────────────────────────────────── */}
      <Header />

      <Box
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '370px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(rgba(147, 51, 234, 0.25) 0%, rgba(126, 34, 206, 0.08) 45%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: '1',
          filter: 'blur(40px)'
        }}
      />


      {/* ── Center Content Container (Logo + Input) ───────────────────────── */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 620,
          px: { xs: 2.5, sm: 3 },
          boxSizing: "border-box",
          mt: "-2vh",
        }}
      >
        {/* Logo */}
        {animationData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 0 }}
            // animate={{ opacity: isTyping ? 0 : 1, y: isTyping ? -20 : 0 }}
            animate={{
              opacity: isTyping ? 0 : 1,
              scale: 1,
              y: isTyping ? -36 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: "32px" }}
          >
            <Box
              sx={{
                width: "min(240px, 65vw)",
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <GenericLottie
                animationData={animationData}
                width="100%"
              />
            </Box>
          </motion.div>
        )}

        {/* Input Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          <Box
            onClick={() => inputRef.current?.focus()}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              borderRadius: "9999px",
              border: "1px solid",
              borderColor: isFocused
                ? isLight
                  ? "rgba(0, 0, 0, 0.25)"
                  : "rgba(255, 255, 255, 0.28)"
                : isLight
                  ? "rgba(0, 0, 0, 0.12)"
                  : "rgba(255, 255, 255, 0.14)",
              backgroundColor: isLight
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(18, 18, 22, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: isFocused
                ? isLight
                  ? "0 8px 24px rgba(0, 0, 0, 0.08)"
                  : "0 8px 32px rgba(0, 0, 0, 0.45)"
                : isLight
                  ? "0 4px 16px rgba(0, 0, 0, 0.03)"
                  : "0 4px 20px rgba(0, 0, 0, 0.35)",
              transition: "border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
              padding: "6px 6px 6px 22px",
              boxSizing: "border-box",
              cursor: "text",
            }}
          >
            <InputBase
              inputRef={inputRef}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Send Message..."
              sx={{
                color: isLight ? "#000000" : "#ffffff",
                fontSize: { xs: "15px", sm: "16px" },
                fontFamily: "inherit",
                lineHeight: 1.5,
                flex: 1,
                mr: 1,
                "& input": {
                  padding: "10px 0",
                  "&::placeholder": {
                    color: isLight
                      ? "rgba(0, 0, 0, 0.4)"
                      : "rgba(255, 255, 255, 0.4)",
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Circular Send Button with Up Arrow */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleSend();
              }}
              disabled={isSendDisabled}
              aria-label="Send prompt"
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                backgroundColor: isSendDisabled
                  ? isLight
                    ? "rgba(0, 0, 0, 0.08)"
                    : "rgba(255, 255, 255, 0.12)"
                  : isLight
                    ? "#000000"
                    : "#ffffff",
                color: isSendDisabled
                  ? isLight
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.3)"
                  : isLight
                    ? "#ffffff"
                    : "#000000",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: isSendDisabled
                    ? isLight
                      ? "rgba(0, 0, 0, 0.08)"
                      : "rgba(255, 255, 255, 0.12)"
                    : isLight
                      ? "#222222"
                      : "#f0f0f0",
                  transform: isSendDisabled ? "none" : "scale(1.05)",
                },
                "&:active": {
                  transform: isSendDisabled ? "none" : "scale(0.95)",
                },
                "&.Mui-disabled": {
                  backgroundColor: isLight
                    ? "rgba(0, 0, 0, 0.08)"
                    : "rgba(255, 255, 255, 0.12)",
                  color: isLight
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              <ArrowUp size={20} strokeWidth={2.2} />
            </IconButton>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default WelcomePage;