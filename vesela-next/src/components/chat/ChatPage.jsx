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
  const { messages, sendMessage, isConnected, isTyping, isThinking } =
    useChatSocket();
  const { openModal } = useModal();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const bottomRef = useRef(null);

  const sentInitialRef = useRef(false);

  const {
    consumePendingHeroMessage,
    guestMessages,
    canSendGuestMessage,
    sendGuestMessage,
    guestLoading,
  } = useChatSession();

  /*
   * Auth state
   */
  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(Boolean(localStorageUtil.get(TOKEN)));
    };

    updateAuth();

    window.addEventListener("storage", updateAuth);

    return () => {
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  /*
   * Merge guest + auth messages
   */
  const mergedMessages = useMemo(() => {
    if (isAuthenticated) {
      return [...guestMessages, ...messages];
    }

    return guestMessages;
  }, [guestMessages, isAuthenticated, messages]);

  /*
   * Auto scroll
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mergedMessages.length, isThinking, guestLoading]);

  /*
   * Initial hero message
   */
  useEffect(() => {
    if (sentInitialRef.current) return;

    const pendingMessage = consumePendingHeroMessage();

    if (!pendingMessage) return;

    sentInitialRef.current = true;

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

  /*
   * Send handler
   */
  const handleSend = async (text) => {
    if (isAuthenticated) {
      sendMessage(text);
      return;
    }

    const result = await sendGuestMessage(text);

    if (!result.ok && result.reason === "limit") {
      setUpgradeOpen(true);
    }
  };

  const isGuestLocked = !isAuthenticated && !canSendGuestMessage;

  return (
    <>
      {/* Guest Lock Banner */}
      <GuestLimitBanner
        open={isGuestLocked}
        onClick={() => openModal(MODALS.LOGIN)}
      />

      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          pt: 10, 
          pb: isGuestLocked ? 22 : 13, 
          minHeight: "100vh",
        }}
      >
        {/* Chat Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Container maxWidth="md">
            {mergedMessages.map((msg, i) => (
              <ChatBubble
                key={i}
                role={msg.role}
                message={msg.message}
                isTyping={
                  isAuthenticated && isTyping && i === mergedMessages.length - 1
                }
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

        {/* Chat Input */}
        <ChatInput
          onSend={handleSend}
          isConnected={isAuthenticated ? isConnected : true}
          isGuestLocked={isGuestLocked}
        />
      </Box>
    </>
  );
}
