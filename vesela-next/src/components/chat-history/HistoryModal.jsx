"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  Box,
  DialogContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Typography,
  Slide,
  Button,
} from "@mui/material";
import { X, ArrowLeft, MessageCircleMore } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ChatPreview from "./ChatPreview";
import { useChatHistory } from "@/hooks/useChatHistory";
import ChatList from "./ChatList";

const SlideTransition = React.forwardRef(function SlideTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
SlideTransition.displayName = "SlideTransition";

const HistoryModal = ({ open, onClose }) => {
  const theme = useTheme();

  // { noSsr: true } prevents hydration mismatch on mobile devices
  const isMobile = useMediaQuery("(max-width:767px)", { noSsr: true });

  // Mobile navigation: "list" (default) | "preview"
  const [mobileView, setMobileView] = useState("list");

  const {
    chatHistory,
    selectedChatId,
    setSelectedChatId,
    loading,
    error,
    refresh,
  } = useChatHistory(open);

  // Reset to list when modal closes or when viewport exits mobile width
  useEffect(() => {
    if (!open || !isMobile) setMobileView("list");
  }, [open, isMobile]);

  const handleSelectChat = useCallback(
    (chatId) => {
      setSelectedChatId(chatId);
      if (isMobile) setMobileView("preview");
    },
    [isMobile, setSelectedChatId]
  );

  const handleBack = useCallback(() => setMobileView("list"), []);

  // Uses the modalBackground palette key (maps to surface.modal token in theme.jsx)
  // — same pattern as VeselaAI's modalBackground usage
  const modalBg =
    theme.palette.background.modalBackground ?? theme.palette.background.paper;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="lg"
      // Slide-up transition migrated from VeselaAI
      TransitionComponent={SlideTransition}
      PaperProps={{
        sx: {
          width: "100%",
          height: isMobile ? "100dvh" : "85vh",
          maxHeight: isMobile ? "100dvh" : "860px",
          display: "flex",
          flexDirection: "column",
          borderRadius: isMobile ? 0 : 1,
          overflow: "hidden",
          bgcolor: modalBg,
          backgroundImage: "none",
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          py: 1.5,
          flexShrink: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: modalBg,
          minHeight: 56,
        }}
      >
        {/* Left: optional back arrow (mobile preview) + title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && mobileView === "preview" && (
            <IconButton
              onClick={handleBack}
              size="small"
              aria-label="Back to chat list"
              sx={{ color: "text.primary", p: 0.5, mr: 0.5 }}
            >
              <ArrowLeft size={20} />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              color: theme.palette.text.primary,
            }}
          >
            {isMobile && mobileView === "preview" ? "Conversation" : "Chat History"}
          </Typography>
        </Box>

        {/* Close button — rotate(90deg) on hover, migrated from VeselaAI */}
        <IconButton
          onClick={onClose}
          aria-label="Close chat history"
          sx={{
            color: theme.palette.text.secondary,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.action.hover,
              transform: "rotate(90deg)",
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <DialogContent
        sx={{
          overflow: "hidden",
          flex: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          bgcolor: modalBg,
        }}
      >
        {/* ── Loading — migrated: spinner + descriptive text ── */}
        {loading && chatHistory.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 200,
              gap: 2,
              color: theme.palette.text.secondary,
            }}
          >
            <CircularProgress size={36} thickness={4} color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Retrieving your conversations...
            </Typography>
          </Box>
        ) : error ? (
          /* ── Error state — migrated from VeselaAI (was silently ignored) ── */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 200,
              p: 3,
              textAlign: "center",
              gap: 2,
            }}
          >
            <Typography variant="body1" color="error" sx={{ fontWeight: 600 }}>
              {typeof error === "string"
                ? error
                : "Failed to load conversation history"}
            </Typography>
            <Button
              variant="outlined"
              onClick={refresh}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                "&:hover": {
                  borderColor: theme.palette.error.dark,
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              Retry Loading
            </Button>
          </Box>
        ) : isMobile ? (
          /* ── Mobile: AnimatePresence slide (framer-motion, same as VeselaAI) ── */
          <Box
            sx={{
              height: "100%",
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              {mobileView === "list" ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: "100%", width: "100%" }}
                >
                  <ChatList
                    selectedChatId={selectedChatId}
                    onSelectChat={handleSelectChat}
                    chatHistory={chatHistory}
                    isVisible
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: "100%", width: "100%" }}
                >
                  <ChatPreview chatId={selectedChatId} />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        ) : (
          /* ── Tablet & Desktop: permanent side-by-side layout ── */
          <Box sx={{ display: "flex", flex: 1, minHeight: 0, height: "100%" }}>
            {/* List panel — fixed width, independently scrollable */}
            <Box
              sx={{
                width: { sm: "32%", lg: "30%" },
                flexShrink: 0,
                borderRight: `1px solid ${theme.palette.divider}`,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <ChatList
                selectedChatId={selectedChatId}
                onSelectChat={handleSelectChat}
                chatHistory={chatHistory}
                isVisible
              />
            </Box>

            {/* Preview panel — fills remaining width */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
                // Subtle tinted background from VeselaAI (mode-aware, no raw hex)
                bgcolor:
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.015)"
                    : "rgba(255,255,255,0.015)",
              }}
            >
              {selectedChatId ? (
                <ChatPreview chatId={selectedChatId} />
              ) : (
                /* ── Rich empty state — migrated from VeselaAI ── */
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: theme.palette.text.secondary,
                    gap: 2,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor:
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.04)"
                          : "rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <MessageCircleMore size={28} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    No Chat Selected
                  </Typography>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    Choose a conversation from the sidebar to view details and
                    message logs.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
