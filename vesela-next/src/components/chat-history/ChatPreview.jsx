"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Share2 } from "lucide-react";
import { useChatDetails } from "@/hooks/useChatDetails";
import ChatBubble from "../chat/ChatBubble";
import ShareModal from "../modals/ShareModal";
import { scrollbarStyles } from "@/utils/scrollbar";


const ChatPreview = ({ chatId }) => {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const [shareOpen, setShareOpen] = useState(false);

  const { messages, loading, error } = useChatDetails(chatId);
  useEffect(() => {
    if (!loading && messages.length > 0 && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  // Show sub-header and share button only when a chat is fully loaded
  const showSubHeader = chatId && !loading && !error && messages.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── "Saved Conversation" sub-header — migrated from VeselaAI ── */}
      {showSubHeader && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
            py: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexShrink: 0,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Saved Conversation
          </Typography>
          {/* Share button — migrated from VeselaAI */}
          <IconButton
            onClick={() => setShareOpen(true)}
            size="small"
            title="Share this conversation"
            aria-label="Share conversation"
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "rgba(40,108,168,0.06)"
                    : "rgba(40,108,168,0.12)",
              },
            }}
          >
            <Share2 size={18} />
          </IconButton>
        </Box>
      )}

      {/* ── Scrollable message area ── */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          p: { xs: 1.5, md: 2 },
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
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              color="error"
              align="center"
              sx={{ fontWeight: 500, maxWidth: 300 }}
            >
              {typeof error === "string"
                ? error
                : "Could not retrieve conversation history"}
            </Typography>
          </Box>
        ) : !chatId ? (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              opacity: 0.6,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Select a conversation to preview history
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            {messages.length > 0
              ? messages.map((msg, index) => (
                <ChatBubble
                  key={`${msg.id}-${index}`}
                  role={msg.sender}
                  message={msg.text}
                />
              ))
              : null}
            <div ref={scrollRef} style={{ height: "1px" }} />
          </Box>
        )}
      </Box>

      {/* ── Share Modal — migrated from VeselaAI ── */}
      {shareOpen && (
        <ShareModal
          open={shareOpen}
          conversationId={chatId}
          onClose={() => setShareOpen(false)}
        />
      )}
    </Box>
  );
};

export default ChatPreview;
