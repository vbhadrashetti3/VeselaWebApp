"use client";

import { Box, Typography, Paper } from "@mui/material";

export default function ChatBubble({
  role,
  message,
  isTyping,
  isThinking,
  isError,
}) {
  const isAI = role === "assistant";

  if (isThinking) {
    return (
      <Typography sx={{ opacity: 0.6 }}>
        Thinking<span className="dots">...</span>
      </Typography>
    );
  }

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
          padding: "10px 14px",
          maxWidth: "80%",
          bgcolor: isAI ? "#000" : "#1e1e26",
          color: "#fff",
          borderRadius: "10px",
        }}
      >
        <Typography sx={{ fontSize: "14px" }}>
          {message}
          {isAI && isTyping && <span>|</span>}
        </Typography>

        {isError && (
          <Typography sx={{ fontSize: 12, color: "red" }}>
            Retry later
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
