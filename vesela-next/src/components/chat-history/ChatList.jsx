"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItemButton, // Updated from ListItem button prop
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { MessageCircleMore } from "lucide-react";
import { scrollbarStyles } from "@/utils/scrollbar";

const ChatList = ({ onSelectChat, selectedChatId, chatHistory = [] }) => {
  const theme = useTheme();
  const selectedRef = useRef(null);

  // Auto-scroll to selected chat in history
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedChatId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (chatHistory.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No conversations found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 1,
        overflowY: "auto",
        height: "100%", // Let the parent Grid determine height
        bgcolor: "transparent",
        ...scrollbarStyles(theme),
      }}
    >
      <List sx={{ py: 0 }}>
        {chatHistory.map((chat) => {
          const isSelected = selectedChatId === chat.id;

          return (
            <ListItemButton
              key={chat.id}
              ref={isSelected ? selectedRef : null}
              onClick={() => onSelectChat(chat.id)}
              sx={{
                borderRadius: "8px",
                mb: 0.5,
                transition: "all 0.2s",
                // High-density enterprise styling
                bgcolor: isSelected
                  ? alpha(theme.palette.primary.main, 0.15)
                  : "transparent",
                border: "1px solid",
                borderColor: isSelected
                  ? alpha(theme.palette.primary.main, 0.35)
                  : "transparent",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  borderColor: alpha(theme.palette.primary.main, 0.12),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                <MessageCircleMore size={16} />
              </ListItemIcon>
              <ListItemText
                primary={formatDate(chat.date)}
                primaryTypographyProps={{
                  fontSize: "13px",
                  fontWeight: isSelected ? 600 : 400,
                  noWrap: true,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default ChatList;
