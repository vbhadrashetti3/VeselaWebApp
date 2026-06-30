"use client";

import { Box, Button, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GenericLottie from "@/components/ui/GenericLottie";
import barsTyping from "@/../public/bars-typing.json";

export default function ChatBubble({
  role,
  message,
  isStreaming,
  isError,
  onRetry,
}) {
  const theme = useTheme();
  const isAI = role === "assistant";

  const lottieFilter =
    theme.palette.mode === "dark" ? "invert(1) brightness(2)" : "none";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isAI ? "row" : "row-reverse",
        mb: 3,
      }}
    >
      <Paper
        sx={{
          padding: "10px 14px",
          maxWidth: { xs: "95%", sm: "85%", md: "78%" },
          border: "none",
          bgcolor: isAI
            ? theme.palette.chat?.bot || "#ffffff"
            : theme.palette.chat?.user || "#E0E0E0",
          color: theme.palette.text.primary,
          borderRadius: "8px",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >

        <Typography
          component="div"
          sx={{
            fontSize: "15px",
            lineHeight: 1.6,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "4px",
            minHeight: "22px", // prevents zero-height flash before first chunk
          }}
        >
          {message}

          {/* Inline loader — visible the entire time isStreaming is true */}
          {isAI && isStreaming && (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                verticalAlign: "middle",
                flexShrink: 0,
                filter: lottieFilter,
              }}
            >
              <GenericLottie
                animationData={barsTyping}
                width={message ? 40 : 80}
                height={message ? 14 : 22}
                loop={true}
              />
            </Box>
          )}
        </Typography>

        {/* Error UI — unchanged */}
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
