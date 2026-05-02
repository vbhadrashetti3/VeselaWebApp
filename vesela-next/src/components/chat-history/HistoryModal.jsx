"use client";

import React from "react";
import {
  Dialog,
  Box,
  DialogContent,
  CircularProgress,
  Grid,
  useTheme,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import ChatPreview from "./ChatPreview";
import { useChatHistory } from "@/hooks/useChatHistory";
import ChatList from "./ChatList";

const HistoryModal = ({ open, onClose }) => {
  const theme = useTheme();
  const { chatHistory, selectedChatId, setSelectedChatId, loading } =
    useChatHistory(open);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg" // Adjust to "md" if "lg" is too wide for your dashboard
      scroll="paper"
      PaperProps={{
        sx: {
          height: "85vh", // Forces a consistent vertical size
          maxHeight: "800px", // Prevents it from becoming too tall on ultra-wide monitors
          bgcolor: "#0d0d12", // Enterprise dark theme
          backgroundImage: "none",
          borderRadius: 2,
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
        <IconButton onClick={onClose} sx={{ color: "grey.500" }}>
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
          <Grid container sx={{ flex: 1, height: "100%", width: "100%" }}>
            <Grid
              size={{ xs: 12, md: 3.5 }}
              sx={{
                height: "100%",
                borderRight: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
              }}
            >
              <ChatList
                selectedChatId={selectedChatId}
                onSelectChat={setSelectedChatId}
                chatHistory={chatHistory}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 8.5 }}
              sx={{ height: "100%", overflow: "hidden" }}
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
