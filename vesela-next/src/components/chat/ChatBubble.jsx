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
        mb: 2,
      }}
    >
      <Paper
        sx={{
          padding: "8px 12px",
          maxWidth: { xs: "95%", sm: "85%", md: "78%" },
          bgcolor: isAI
            ? theme.palette.chat?.bot || "#ffffff"
            : theme.palette.chat?.user || "#E0E0E0",
          color: theme.palette.text.primary,
          borderRadius: "12px",
          border: `1px solid ${theme.palette.sendMsgInput?.sendMsgBorder || theme.palette.divider}`,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {/*
         * Message body.
         * component="div" prevents the <div>-inside-<p> hydration error
         * that occurs when the Lottie <div> is rendered inline.
         */}
        <Typography
          component="div"
          sx={{
            fontSize: "14px",
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
