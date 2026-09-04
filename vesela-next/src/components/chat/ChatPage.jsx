"use client";

import { Box, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import GuestLimitBanner from "./GuestLimitBanner";
import VoiceOverlay from "@/components/voice/VoiceOverlay";

import { useAuth } from "@/context/AuthContext";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useVoiceSession } from "@/hooks/useVoiceSession";
import { CHAT_CONTAINER_MAX_WIDTH } from "@/constant";
import { useChatSession } from "@/context/ChatSessionContext";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "../modals/modalConstants";

export default function ChatPage() {
  const { isAuthenticated, isSessionChecked, wsToken, userId, isPro } = useAuth();
  const theme = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Connect as soon as we know the user is signed in. An expired wsToken is OK —
  // the socket hook refreshes in the background. Waiting on isTokenReady used to
  // leave the composer on "Connecting..." and drop queued sends.
  const socketToken = isSessionChecked && isAuthenticated
    ? (wsToken || null)
    : null;

  const {
    messages,
    sendMessage,
    isConnected,
    isStreaming: isAuthStreaming,
    isLocked: isAuthLocked,
    connectionFailed,
    conversationExpired,
    reconnect,
    adoptConversationId,
    appendTranscriptTurn,
    hydrateFromConversation,
  } = useChatSocket(socketToken, userId, isPro);

  const router = useRouter();
  const [expiredCountdown, setExpiredCountdown] = useState(null);
  const countdownDisplay = conversationExpired ? (expiredCountdown ?? 3) : null;

  // Expired thread: same destination as hamburger "New Chat", after a 3-2-1 beat.
  useEffect(() => {
    if (!conversationExpired) return undefined;

    let remaining = 3;
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        if (typeof window !== "undefined") {
          localStorage.removeItem("vesela_active_conversation_id");
        }
        router.push("/welcome");
        return;
      }
      setExpiredCountdown(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [conversationExpired, router]);

  const {
    consumePendingHeroMessage,
    guestMessages,
    sendGuestMessage,
    guestLoading: isGuestStreaming,
    resetGuestSession,
    guestSignupRequired,
  } = useChatSession();

  const { openModal } = useModal();
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleVoiceExpired = () => {
    setVoiceOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vesela_active_conversation_id");
    }
    router.push("/welcome");
  };

  const {
    status: voiceStatus,
    error: voiceError,
    activityLevel,
    start: startVoice,
    hangup: hangupVoice,
  } = useVoiceSession({
    onConversationId: adoptConversationId,
    onTranscriptTurn: appendTranscriptTurn,
    onExpired: handleVoiceExpired,
  });

  useEffect(() => {
    if (isAuthenticated) {
      resetGuestSession?.();
    }
  }, [isAuthenticated, resetGuestSession]);

  // ─── Pending hero message ──────────────────────────────────────────────────
  // One-shot: fires when connection is established (if authenticated) or immediately (if guest)
  const pendingFiredRef = useRef(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (pendingFiredRef.current) return;
    if (!isSessionChecked) return;

    // If authenticated, wait until the socket is connected
    if (isAuthenticated && !isConnected) {
      return;
    }

    const pending = consumePendingHeroMessage();
    if (!pending) return;

    pendingFiredRef.current = true;

    if (isAuthenticated) {
      sendMessage(pending);
    } else {
      sendGuestMessage(pending).then((result) => {
        if (!result.ok && result.reason === "locked") {
          openModal(MODALS.LOGIN, { source: "chat" });
        }
      });
    }
  }, [isSessionChecked, isAuthenticated, isConnected, consumePendingHeroMessage, sendMessage, sendGuestMessage, openModal]);

  useEffect(() => {
    if (hydratedRef.current) return;
    if (!isAuthenticated || !isSessionChecked) return;
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("vesela_active_conversation_id")
        : null;
    if (!saved) return;
    hydratedRef.current = true;
    hydrateFromConversation(saved);
  }, [isAuthenticated, isSessionChecked, hydrateFromConversation]);

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

  const isLimitLocked = isAuthenticated ? isAuthLocked && !isPro : guestSignupRequired;
  const isStreaming = isAuthenticated ? isAuthStreaming : isGuestStreaming;
  const isConnectionLocked = isAuthenticated && connectionFailed;
  const isExpiredLocked = Boolean(conversationExpired);
  const isComposerLocked = isLimitLocked || isConnectionLocked || isExpiredLocked;

  const handleVoiceClick = () => {
    if (!isAuthenticated) {
      openModal(MODALS.LOGIN, { source: "chat" });
      return;
    }
    if (!isPro) {
      openModal(MODALS.PLANS, { source: "chat" });
      return;
    }
    if (isConnectionLocked || isExpiredLocked || isStreaming) return;

    setVoiceOpen(true);
    void startVoice();
  };

  const handleVoiceClose = async () => {
    await hangupVoice();
    setVoiceOpen(false);
  };

  return (
    <>
      {isMounted && !isAuthenticated && !isLimitLocked && (
        <GuestLimitBanner
          open
          variant="label"
          onClick={() => openModal(MODALS.LOGIN, { source: "chat" })}
          message="You are chatting with Vesela's assistant about our services. Make an account or sign in to talk to Vesela"
        />
      )}

      {isMounted && isLimitLocked && (
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
      )}

      {isMounted && isConnectionLocked && (
        <GuestLimitBanner
          open={isConnectionLocked}
          onClick={() => reconnect()}
          message="Unable to connect. Tap to retry."
        />
      )}

      {/* Gradient overlay — fades the page background into the transparent header.
          Must live here (not inside AppBar) because AppBar's own background would
          cover it. fixed + zIndex keeps it above scrolling messages, below AppBar
          controls. Matches the reference ChatWindow gradient exactly. */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "100px",
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)"
              : "linear-gradient(to bottom, rgba(0, 0, 0, 1) 10%, rgb(0 0 0 / 90%) 40%, rgba(0, 0, 0, 0) 100%)",
          // Allow clicks to pass through to the AppBar menu icon above
          pointerEvents: "none",
          zIndex: (t) => t.zIndex.appBar - 1,
        }}
      />

      <Box sx={{ display: "flex", flexDirection: "column", pt: { xs: 8, sm: 9, md: 10 }, pb: { xs: 14, sm: 13 } }}>
        <Box ref={containerRef} sx={{ flex: 1, overflowY: "auto", pb: "30px" }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: CHAT_CONTAINER_MAX_WIDTH,
              mx: "auto",
              px: { xs: 2, sm: 2.5 },
              boxSizing: "border-box",
            }}
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
                  footer={
                    msg.isExpired && countdownDisplay != null
                      ? `Starting a new chat… ${countdownDisplay}`
                      : undefined
                  }
                />
              );
            })}

            <div ref={bottomRef} />
          </Box>
        </Box>

        <ChatInput
          onSend={handleSend}
          onVoiceClick={handleVoiceClick}
          voiceDisabled={isConnectionLocked || isExpiredLocked || isStreaming}
          isGuestLocked={isComposerLocked}
          lockPlaceholder={
            isConnectionLocked
              ? "Unable to connect. Tap the banner to retry..."
              : isExpiredLocked
                ? "Starting a new chat..."
                : undefined
          }
        />
      </Box>

      {voiceOpen && (
        <VoiceOverlay
          themeMode={theme.palette.mode}
          activityLevel={activityLevel}
          error={voiceStatus === "error" ? voiceError : null}
          onClose={handleVoiceClose}
        />
      )}
    </>
  );
}
