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
  // ─── Auth ──────────────────────────────────────────────────────────────────
  const { isAuthenticated, token, userId } = useAuth();

  // ─── WebSocket (auth users only) ───────────────────────────────────────────
  // Pass null token when guest — hook stays disconnected
  const {
    messages,
    sendMessage,
    isConnected,
    isTyping,
    isThinking,
    isLocked: isAuthLocked,
  } = useChatSocket(isAuthenticated ? token : null, userId);

  // ─── Guest session ─────────────────────────────────────────────────────────
  const {
    consumePendingHeroMessage,
    guestMessages,
    sendGuestMessage,
    guestLoading,
    resetGuestSession,
    guestSignupRequired,
  } = useChatSession();

  const { openModal } = useModal();

  // ─── Clear guest data when user logs in ────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      resetGuestSession?.();
    }
  }, [isAuthenticated, resetGuestSession]);

  // ─── Pending hero message ──────────────────────────────────────────────────
  // One-shot: fires once per mount to consume a message typed on the hero page.
  const pendingFiredRef = useRef(false);

  useEffect(() => {
    if (pendingFiredRef.current) return;

    const pending = consumePendingHeroMessage();
    if (!pending) return;

    pendingFiredRef.current = true;

    if (isAuthenticated) {
      sendMessage(pending); // queued internally if socket not yet open
    } else {
      sendGuestMessage(pending).then((result) => {
        if (!result.ok && result.reason === "locked") {
          openModal(MODALS.LOGIN, { source: "chat" });
        }
      });
    }
    // consumePendingHeroMessage deliberately omitted from deps.
    // It changes identity every time pendingHeroMessage state updates (localStorage
    // hydration), which would cause double-sends. We capture it in the first run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ─── Combined message list ─────────────────────────────────────────────────
  // Auth: show guest history + ws messages (guest messages cleared on login)
  // Guest: show guest messages only
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
  // No deps — runs after every render. useLayoutEffect avoids flash.
  // The near-bottom guard prevents hijacking scroll when user reads history.

  // ─── Send handler ──────────────────────────────────────────────────────────
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

  // ─── Lock state ────────────────────────────────────────────────────────────
  const isLimitLocked = isAuthenticated
    ? isAuthLocked
    : guestSignupRequired;

  // ─── Render ────────────────────────────────────────────────────────────────
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

      <Box sx={{ display: "flex", flexDirection: "column", pt: 10, pb: 13 }}>
        <Box ref={containerRef} sx={{ flex: 1, overflowY: "auto", pb: "30px" }}>
          <Container
            maxWidth={false}
            sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%" }}
          >
            {mergedMessages.map((msg, i) => (
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
                isTyping={
                  msg.role === "assistant" &&
                  i === mergedMessages.length - 1 &&
                  isTyping
                }
              />
            ))}

            {/* Thinking indicator */}
            {isAuthenticated && isThinking && (
              <ChatBubble role="assistant" message="Thinking..." isThinking />
            )}
            {!isAuthenticated && guestLoading && (
              <ChatBubble role="assistant" message="Thinking..." isThinking />
            )}

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
