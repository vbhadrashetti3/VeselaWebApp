"use client";

import { Box, Container } from "@mui/material";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import GuestLimitBanner from "./GuestLimitBanner";

import { useAuth } from "@/context/AuthContext";
import { useChatSocket } from "@/hooks/useChatSocket";
import { CHAT_CONTAINER_MAX_WIDTH } from "@/constant";
import { useChatSession } from "@/context/ChatSessionContext";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "../modals/modalConstants";

export default function ChatPage() {
  const { isAuthenticated, token, userId } = useAuth();
  const {
    messages,
    sendMessage,
    isConnected,
    isStreaming: isAuthStreaming,
    isLocked: isAuthLocked,
  } = useChatSocket(isAuthenticated ? token : null, userId);

  const {
    consumePendingHeroMessage,
    guestMessages,
    sendGuestMessage,
    guestLoading: isGuestStreaming,
    resetGuestSession,
    guestSignupRequired,
  } = useChatSession();

  const { openModal } = useModal();

  useEffect(() => {
    if (isAuthenticated) {
      resetGuestSession?.();
    }
  }, [isAuthenticated, resetGuestSession]);

  // ─── Pending hero message ──────────────────────────────────────────────────
  // One-shot: fires when connection is established (if authenticated) or immediately (if guest)
  const pendingFiredRef = useRef(false);

  useEffect(() => {
    if (pendingFiredRef.current) return;

    // If authenticated, wait until the socket is connected
    if (isAuthenticated && !isConnected) {
      console.log("[ChatPage] Waiting for WebSocket connection before sending pending message...");
      return;
    }

    const pending = consumePendingHeroMessage();
    if (!pending) return;

    pendingFiredRef.current = true;
    console.log(`[ChatPage] Consumed pending hero message: "${pending}". Authenticated: ${isAuthenticated}`);

    if (isAuthenticated) {
      console.log("[ChatPage] Sending pending message via WebSocket");
      sendMessage(pending);
    } else {
      console.log("[ChatPage] Sending pending message as guest via HTTP");
      sendGuestMessage(pending).then((result) => {
        if (!result.ok && result.reason === "locked") {
          openModal(MODALS.LOGIN, { source: "chat" });
        }
      });
    }
  }, [isAuthenticated, isConnected, consumePendingHeroMessage, sendMessage, sendGuestMessage, openModal]);

  const mergedMessages = useMemo(
    () => (isAuthenticated ? [...guestMessages, ...messages] : guestMessages),
    [isAuthenticated, guestMessages, messages],
  );

  // ─── Auto-scroll ───────────────────────────────────────────────────────────
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Only auto-scroll if the user is already near the bottom (within 150px)
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 150) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });
  const handleSend = async (text) => {
    if (isAuthenticated) {
      sendMessage(text);
      return;
    }

    const result = await sendGuestMessage(text);
    if (!result.ok && result.reason === "locked") {
      openModal(MODALS.LOGIN, { source: "chat" });
    }
  };

  const isLimitLocked = isAuthenticated ? isAuthLocked : guestSignupRequired;
  const isStreaming = isAuthenticated ? isAuthStreaming : isGuestStreaming;

  return (
    <>
      <GuestLimitBanner
        open={isLimitLocked}
        onClick={() => {
          openModal(isAuthenticated ? MODALS.PLANS : MODALS.LOGIN, {
            source: "chat",
          });
        }}
        message={
          isAuthenticated
            ? "Free message limit reached. Upgrade to Pro to continue."
            : "Free guest limit reached. Login or upgrade to continue."
        }
      />

      <Box sx={{ display: "flex", flexDirection: "column", pt: { xs: 8, sm: 9, md: 10 }, pb: { xs: 14, sm: 13 } }}>
        <Box ref={containerRef} sx={{ flex: 1, overflowY: "auto", pb: "30px" }}>
          <Container
            maxWidth={false}
            sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%", px: { xs: 1.5, sm: 2, md: 3 } }}
          >
            {mergedMessages.map((msg, i) => {
              const isLastAssistant =
                msg.role === "assistant" && i === mergedMessages.length - 1;
              return (
                <ChatBubble
                  key={msg.id || i}
                  role={msg.role}
                  message={msg.message}
                  isError={msg.isError}
                  onRetry={
                    msg.isError && msg.retryText
                      ? () => handleSend(msg.retryText)
                      : undefined
                  }
                  isStreaming={isLastAssistant && isStreaming}
                />
              );
            })}

            <div ref={bottomRef} />
          </Container>
        </Box>

        <ChatInput
          onSend={handleSend}
          isConnected={isAuthenticated ? isConnected : true}
          isGuestLocked={isLimitLocked}
        />
      </Box>
    </>
  );
}
