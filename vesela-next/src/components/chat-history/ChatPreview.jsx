"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  alpha,
} from "@mui/material";
import { useChatDetails } from "@/hooks/useChatDetails"; // Import your hook
import ChatBubble from "../chat/ChatBubble";
import { scrollbarStyles } from "@/utils/scrollbar";

const ChatPreview = ({ chatId }) => {
  const theme = useTheme();
  const scrollRef = useRef(null);

  // Use the custom hook
  const { messages, loading } = useChatDetails(chatId);

  // Auto-scroll logic remains in the component as it's a UI concern
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  return (
    <Box
      sx={{
        overflowY: "auto",
        height: "100%",
        p: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.02),
        display: "flex",
        flexDirection: "column",
        ...scrollbarStyles(theme),
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={28} thickness={4} />
        </Box>
      ) : !chatId ? (
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.6,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Select a conversation to preview history
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          {messages.length > 0 &&
            messages.map((msg, index) => (
              <ChatBubble
                key={`${msg.id}-${index}`} // Always include a unique key when mapping
                role={msg.sender}
                message={msg.text} // Changed 'messages' to 'message' to match ChatBubble props
              />
            ))}
          <div ref={scrollRef} style={{ height: "1px" }} />
        </Box>
      )}
    </Box>
  );
};

export default ChatPreview;
