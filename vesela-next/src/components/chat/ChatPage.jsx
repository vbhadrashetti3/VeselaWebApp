"use client";

import { Box, Container } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import GuestLimitBanner from "./GuestLimitBanner";

import { useChatSocket } from "@/hooks/useChatSocket";
import { TOKEN, CHAT_CONTAINER_MAX_WIDTH } from "@/constant";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { useChatSession } from "@/context/ChatSessionContext";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "../modals/modalConstants";

export default function ChatPage() {
  const isAuthenticated = Boolean(localStorageUtil.get(TOKEN));

  // 🟢 SOCKET ONLY IF AUTH
  const {
    messages,
    sendMessage,
    isConnected,
    isThinking,
    isTyping,
    isLocked: isAuthLocked,
  } = useChatSocket(isAuthenticated);

  const {
    consumePendingHeroMessage,
    guestMessages,
    sendGuestMessage,
    guestLoading,
    resetGuestSession,
    guestSignupRequired,
  } = useChatSession();

  const { openModal } = useModal();

  const bottomRef = useRef(null);

  const mergedMessages = useMemo(() => {
    return isAuthenticated ? [...guestMessages, ...messages] : guestMessages;
  }, [isAuthenticated, guestMessages, messages]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // 🔥 wipe guest memory when user logs in
    resetGuestSession?.();
  }, [isAuthenticated, resetGuestSession]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mergedMessages.length, isThinking, guestLoading]);

  useEffect(() => {
    const pendingMessage = consumePendingHeroMessage();

    if (!pendingMessage) return;

    if (isAuthenticated) {
      sendMessage(pendingMessage);
    } else {
      void sendGuestMessage(pendingMessage).then((result) => {
        if (!result.ok && result.reason === "locked") {
          openModal(MODALS.LOGIN, { source: "chat" });
        }
      });
    }
  }, [
    consumePendingHeroMessage,
    isAuthenticated,
    sendGuestMessage,
    sendMessage,
    openModal,
  ]);

  // ---------------- SEND ----------------
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

  const isGuestLocked = !isAuthenticated && guestSignupRequired;
  const isLimitLocked = isAuthenticated ? isAuthLocked : isGuestLocked;

  return (
    <>
      <GuestLimitBanner
        open={isLimitLocked}
        onClick={() => {
          if (isAuthenticated) {
            openModal(MODALS.PLANS);
          } else {
            openModal(MODALS.LOGIN, { source: "chat" });
          }
        }}
        message={
          isAuthenticated
            ? "Free message limit reached. Upgrade to Pro to continue."
            : "Free guest limit reached. Login or upgrade to continue."
        }
      />
      <Box sx={{ display: "flex", flexDirection: "column", pt: 10, pb: 13 }}>
        <Box sx={{ flex: 1, overflowY: "auto", pb: "30px" }}>
          <Container maxWidth={false} sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%" }}>
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

            {/* Auth thinking */}
            {isAuthenticated && isThinking && (
              <ChatBubble role="assistant" message="Thinking..." isThinking />
            )}

            {/* Guest thinking */}
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
