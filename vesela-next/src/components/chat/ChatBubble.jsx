"use client";

import { Box, Typography, Paper } from "@mui/material";

export default function ChatBubble({ role, message, isTyping }) {
  const isAI = role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isAI ? "row" : "row-reverse",
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          maxWidth: "80%",
          bgcolor: isAI ? "#000" : "#1e1e26",
          color: "#fff",
        }}
      >
        <Typography>
          {message}
          {isAI && isTyping && <span className="cursor">|</span>}
        </Typography>
      </Paper>
    </Box>
  );
}
