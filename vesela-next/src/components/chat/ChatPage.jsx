"use client";

import { Box, Container } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import GuestLimitBanner from "./GuestLimitBanner";

import { useChatSocket } from "@/hooks/useChatSocket";
import { TOKEN } from "@/constant";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { useChatSession } from "@/context/ChatSessionContext";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "../modals/modalConstants";

export default function ChatPage() {
  const isAuthenticated = Boolean(localStorageUtil.get(TOKEN));

  // 🟢 SOCKET ONLY IF AUTH
  const { messages, sendMessage, isConnected, isTyping, isThinking } =
    useChatSocket(isAuthenticated);

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
        if (!result.ok && result.reason === "limit") {
          setUpgradeOpen(true);
        }
      });
    }
  }, [
    consumePendingHeroMessage,
    isAuthenticated,
    sendGuestMessage,
    sendMessage,
  ]);

  // ---------------- SEND ----------------
  const handleSend = async (text) => {
    if (isAuthenticated) {
      sendMessage(text);
      return;
    }

    const result = await sendGuestMessage(text);

    if (!result.ok && result.reason === "locked") {
      openModal(MODALS.LOGIN);
    }
  };

  const isGuestLocked = !isAuthenticated && guestSignupRequired;

  return (
    <>
      <GuestLimitBanner
        open={isGuestLocked}
        onClick={() => openModal(MODALS.LOGIN)}
      />

      <Box sx={{ display: "flex", flexDirection: "column", pt: 10, pb: 13 }}>
        <Box sx={{ flex: 1, overflowY: "auto", pb: "30px" }}>
          <Container maxWidth="md">
            {mergedMessages.map((msg, i) => (
              <ChatBubble
                key={msg.id || i}
                role={msg.role}
                message={msg.message}
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
          isGuestLocked={isGuestLocked}
        />
      </Box>
    </>
  );
}
