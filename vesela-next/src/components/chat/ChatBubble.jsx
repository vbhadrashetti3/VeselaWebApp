"use client";

import { Box, Typography, Paper } from "@mui/material";

export default function ChatBubble({ role, message }) {
  const isAI = role === "assistant";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isAI ? "row" : "row-reverse",
          mb: 4,
          gap: 2,
        }}
      >
        <Box sx={{ maxWidth: "80%" }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: isAI ? "#000" : "#1e1e26",
              color: "white",
              borderRadius: "10px",
              border: isAI ? "None" : "1px solid #333",
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {message}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
