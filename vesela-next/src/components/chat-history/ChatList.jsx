"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { MessageCircleMore } from "lucide-react";
import { scrollbarStyles } from "@/utils/scrollbar";

// ─── Props ─────────────────────────────────────────────────────────────────────
// onSelectChat  : (chatId) => void
// selectedChatId: string | null
// chatHistory   : { id, date }[]
// isVisible     : boolean — suppresses scrollIntoView when panel is off-screen

const ChatList = ({
  onSelectChat,
  selectedChatId,
  chatHistory = [],
  isVisible = true,
}) => {
  const theme = useTheme();
  const selectedRef = useRef(null);

  // Auto-scroll to selected item — only when this panel is visible
  useEffect(() => {
    if (selectedRef.current && isVisible) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedChatId, isVisible]);

  // ─── Date formatter — migrated from VeselaAI ─────────────────────────────
  // Guard: if the string is already in DD/MM/YYYY format (from a previous
  // format pass or pre-formatted API response), return it as-is instead of
  // re-parsing and potentially shifting the date.
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    // Already formatted: MM/DD/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString.trim())) return dateString.trim();
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // guard: invalid date
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  if (chatHistory.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No conversations found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0, // required for overflowY to work in a flex child
        overflowY: "auto",
        bgcolor: "transparent",
        ...scrollbarStyles(theme),
      }}
    >
      <List
        dense
        sx={{ py: 1, px: 0.5 }}
        role="list"
        aria-label="Chat conversations"
      >
        {chatHistory.map((chat) => {
          const isSelected = selectedChatId === chat.id;

          return (
            // ListItem wrapper provides correct DOM nesting for a11y
            <ListItem
              key={chat.id}
              disablePadding
              ref={isSelected ? selectedRef : null}
              role="listitem"
              aria-current={isSelected ? "true" : undefined}
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                onClick={() => onSelectChat(chat.id)}
                sx={{
                  borderRadius: "8px",
                  transition: "all 0.18s ease",
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.15)
                    : "transparent",
                  border: "1px solid",
                  borderColor: isSelected
                    ? alpha(theme.palette.primary.main, 0.35)
                    : "transparent",
                  "&:hover": {
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.2)
                      : theme.palette.action.hover,
                    borderColor: alpha(theme.palette.primary.main, 0.18),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 32,
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
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
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ChatList;
