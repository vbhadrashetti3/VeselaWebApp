"use client";

import { Box, Button, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GenericLottie from "@/components/ui/GenericLottie";
import barsTyping from "@/../public/bars-typing.json";

export default function ChatBubble({
  role,
  message,
  isTyping,
  isThinking,
  isError,
  onRetry,
}) {
  const theme = useTheme();
  const isAI = role === "assistant";

  if (isThinking) {
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
            padding: "8px 12px",
            maxWidth: "80%",
            bgcolor: isAI
              ? theme.palette.custom.chat.assistantBubble
              : theme.palette.custom.chat.userBubble,
            color: theme.palette.text.primary,
            borderRadius: "10px",
            border: `1px solid ${theme.palette.custom.border.soft}`,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              filter: theme.palette.mode === "dark" ? "invert(1) brightness(2)" : "none",
            }}
          >
            <GenericLottie animationData={barsTyping} width={80} height={22} loop={true} />
          </Box>
        </Paper>
      </Box>
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
          padding: "8px 12px",
          maxWidth: "80%",
          bgcolor: isAI
            ? theme.palette.custom.chat.assistantBubble
            : theme.palette.custom.chat.userBubble,
          color: theme.palette.text.primary,
          borderRadius: "10px",
          border: `1px solid ${theme.palette.custom.border.soft}`,
        }}
      >
        <Typography sx={{ fontSize: "14px", lineHeight: 1.6 }}>
          {message}
          {isAI && isTyping && <span>|</span>}
        </Typography>

        {isError && (
          <Box sx={{ mt: 0.8, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 12, color: "error.main" }}>
              Something failed.
            </Typography>
            {onRetry && (
              <Button
                size="small"
                onClick={onRetry}
                sx={{ minWidth: "auto", p: 0, fontSize: 12 }}
              >
                Retry
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
