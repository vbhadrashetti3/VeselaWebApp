"use client";

import { Box, Container, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useChatSocket } from "@/hooks/useChatSocket";
import { TOKEN } from "@/constant";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { useChatSession } from "@/context/ChatSessionContext";
import GuestUpgradeModal from "../modals/GuestUpgradeModal";

export default function ChatPage() {
  const { messages, sendMessage, isConnected, isTyping, isThinking } = useChatSocket();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const bottomRef = useRef(null);
  const sentInitialRef = useRef(false);
  const {
    consumePendingHeroMessage,
    guestMessages,
    guestMessageCount,
    guestLimit,
    guestLoading,
    canSendGuestMessage,
    sendGuestMessage,
  } = useChatSession();

  useEffect(() => {
    const updateAuth = () => setIsAuthenticated(Boolean(localStorageUtil.get(TOKEN)));
    updateAuth();
    window.addEventListener("storage", updateAuth);
    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  const mergedMessages = useMemo(() => {
    if (isAuthenticated) return [...guestMessages, ...messages];
    return guestMessages;
  }, [guestMessages, isAuthenticated, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mergedMessages.length, isThinking, guestLoading]);

  useEffect(() => {
    if (sentInitialRef.current) return;
    const pendingMessage = consumePendingHeroMessage();
    if (!pendingMessage) return;

    sentInitialRef.current = true;
    if (isAuthenticated) {
      sendMessage(pendingMessage);
    } else {
      void sendGuestMessage(pendingMessage).then((result) => {
        if (!result.ok && result.reason === "limit") setUpgradeOpen(true);
      });
    }
  }, [consumePendingHeroMessage, isAuthenticated, sendGuestMessage, sendMessage]);

  const handleSend = async (text) => {
    if (isAuthenticated) {
      sendMessage(text);
      return;
    }

    const result = await sendGuestMessage(text);
    if (!result.ok && result.reason === "limit") setUpgradeOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", pt: 10, pb: 13, minHeight: "100vh" }}>
      {/* Chat */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Container maxWidth="md">
          {!isAuthenticated && (
            <Stack spacing={1} sx={{ mt: 1, mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Guest usage: {guestMessageCount}/{guestLimit} messages
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(guestMessageCount / guestLimit) * 100}
                sx={{ height: 6, borderRadius: 8 }}
              />
            </Stack>
          )}

          {mergedMessages.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              message={msg.message}
              isTyping={isAuthenticated && isTyping && i === mergedMessages.length - 1}
              isError={msg.isError}
              onRetry={
                msg.isError && msg.retryText
                  ? () => {
                      void handleSend(msg.retryText);
                    }
                  : undefined
              }
            />
          ))}

          {isAuthenticated && isThinking && <ChatBubble role="assistant" message="Thinking..." isThinking />}
          {!isAuthenticated && guestLoading && <ChatBubble role="assistant" message="Thinking..." isThinking />}

          <div ref={bottomRef} />
        </Container>
      </Box>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        isConnected={isAuthenticated ? isConnected : true}
        isTyping={isAuthenticated ? isTyping : guestLoading}
        isGuestLocked={!isAuthenticated && !canSendGuestMessage}
        onGuestLockedClick={() => setUpgradeOpen(true)}
      />

      <GuestUpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </Box>
  );
}
