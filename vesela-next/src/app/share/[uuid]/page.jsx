"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  useTheme,
  Container,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { get } from "@/lib/apiService";
import ChatBubble from "@/components/chat/ChatBubble";

const parseSharedMessages = (apiMessages) => {
  if (!Array.isArray(apiMessages)) return [];
  return apiMessages.map((msg, idx) => ({
    id: msg.id || `${msg.created_at || "msg"}-${idx}`,
    role: msg.role?.toLowerCase() === "assistant" ? "assistant" : "user",
    text: msg.content,
  }));
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};


export const dynamic = "force-dynamic";

export default function SharedConversationPage() {
  const { uuid } = useParams();
  const router = useRouter();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [sharedAt, setSharedAt] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null); // null | 404 | 500
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!uuid) return;

    const fetchSharedChat = async () => {
      setLoading(true);
      setErrorStatus(null);
      setErrorMessage("");
      try {
        const response = await get(`/api/share/${uuid}/`);
        if (response && !response.error) {
          const data = response.data;
          setMessages(parseSharedMessages(data.messages));
          setSharedAt(data.shared_at);
        } else {
          setErrorStatus(response.status || 404);
          setErrorMessage(
            response.message || "Failed to load shared conversation."
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch shared conversation:", err);
        setErrorStatus(500);
        setErrorMessage(
          "An unexpected error occurred while loading this shared conversation."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSharedChat();
  }, [uuid]);

  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        pt: { xs: "80px", sm: "96px", md: "112px" },
        pb: 6,
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 3 },
          width: "100%",
        }}
      >
        {/* ── Loading ── */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 2,
              py: 8,
            }}
          >
            <CircularProgress size={44} thickness={4} color="primary" />
            <Typography variant="body2" color="text.secondary">
              Retrieving shared conversation...
            </Typography>
          </Box>
        ) : errorStatus ? (
          /* ── Error state ── */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              py: 8,
              px: 3,
              textAlign: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: isLight
                  ? "rgba(211,47,47,0.05)"
                  : "rgba(211,47,47,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.error.main,
              }}
            >
              <AlertTriangle size={32} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {errorStatus === 404
                ? "Link Expired or Invalid"
                : "Unable to Load Conversation"}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 450 }}
            >
              {errorStatus === 404
                ? "This shared conversation link has expired, was deleted, or never existed in the first place."
                : errorMessage}
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/")}
              sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 600 }}
            >
              Go to Home Page
            </Button>
          </Box>
        ) : messages.length === 0 ? (
          /* ── Empty conversation ── */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              py: 8,
              gap: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Empty Conversation</Typography>
            <Typography variant="body2" color="text.secondary">
              This shared conversation has no messages.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push("/")}
              sx={{ mt: 2 }}
            >
              Home
            </Button>
          </Box>
        ) : (
          /* ── Message list ── */
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              maxWidth: "680px",
              mx: "auto",
              width: "100%",
            }}
          >
            {/* Conversation header */}
            <Box
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 2,
                mb: 3,
                textAlign: "left",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  mb: 0.5,
                }}
              >
                Shared Chat
              </Typography>
              {sharedAt && (
                <Typography variant="caption" color="text.secondary">
                  Shared on {formatDate(sharedAt)}
                </Typography>
              )}
            </Box>

            {/* Render each message with Vesela's ChatBubble */}
            <Box sx={{ flex: 1 }}>
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  role={msg.role}
                  message={msg.text}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
