"use client";

import React from "react";
import {
  Dialog,
  Box,
  DialogContent,
  CircularProgress,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import ChatPreview from "./ChatPreview";
import { useChatHistory } from "@/hooks/useChatHistory";
import ChatList from "./ChatList";

const HistoryModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { chatHistory, selectedChatId, setSelectedChatId, loading } =
    useChatHistory(open);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          height: isMobile ? "100%" : "85vh",
          maxHeight: isMobile ? "100%" : "800px",
          bgcolor: theme.palette.custom?.surface?.modal ?? theme.palette.background.paper,
          backgroundImage: "none",
          borderRadius: isMobile ? 0 : 2,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header with Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          overflow: "hidden",
          flex: 1,
          display: "flex",
        }}
      >
        {loading && chatHistory.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Grid
            container
            sx={{
              flex: 1,
              height: "100%",
              width: "100%",
              // On mobile stack as column, split height between list and preview
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Chat list — capped height on mobile so preview has room */}
            <Grid
              size={{ xs: 12, md: 3.5 }}
              sx={{
                height: { xs: "auto", md: "100%" },
                maxHeight: { xs: 200, md: "none" },
                flexShrink: { xs: 0, md: 1 },
                borderRight: { md: `1px solid ${theme.palette.divider}` },
                borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: "none" },
                overflow: "hidden",
              }}
            >
              <ChatList
                selectedChatId={selectedChatId}
                onSelectChat={setSelectedChatId}
                chatHistory={chatHistory}
              />
            </Grid>
            {/* Chat preview — takes remaining height on mobile */}
            <Grid
              size={{ xs: 12, md: 8.5 }}
              sx={{
                flex: { xs: 1, md: "unset" },
                height: { xs: "auto", md: "100%" },
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <ChatPreview chatId={selectedChatId} />
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
