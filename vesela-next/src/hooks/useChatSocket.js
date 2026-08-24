"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUTH_LIMIT_LOCKED } from "@/constant";
import {
  refreshAccessToken,
  handleAuthFailure,
} from "@/lib/tokenManager";

// ─── Constants ────────────────────────────────────────────────────────────────

const WS_URL = "wss://portal.grayskyai.com/ws/chat/";

const RETRYABLE_CODES = new Set([1001, 1006, 1011, 1012, 1013, 1014]);
const BASE_BACKOFF_MS = 1000;
/**
 * After this many retryable failures while a reply is pending, run a "hard
 * reconnect" (refresh access token + new socket) — same essentials as page reload.
 */
const HARD_RECONNECT_EVERY = 3;
/** Stop idle reconnects after this many failures and lock the composer. */
const MAX_IDLE_RETRIES = 8;
/** Stop pending-message reconnects after this many failures and lock the composer. */
const MAX_PENDING_RETRIES = 9;

const SILENT_TYPES = new Set(["ping", "pong", "heartbeat", "keepalive"]);

function isConversationExpiredError(data) {
  return data?.expired === true;
}

function clearActiveConversation() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vesela_active_conversation_id");
  }
}

function utcDateString() {
  return new Date().toISOString().slice(0, 10);
}

function msUntilNextUtcMidnight() {
  const now = new Date();
  return (
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) -
    now.getTime()
  );
}

function readAuthLimitLocked() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_LIMIT_LOCKED) === utcDateString();
}

export const useChatSocket = (token, userId, isPro = false) => {
  const socketRef = useRef(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);
  const isDisposedRef = useRef(false);
  const userIdRef = useRef(userId);
  const tokenRef = useRef(token);
  const prevTokenRef = useRef(null);
  const isAuthRecoveringRef = useRef(false);

  const currentAssistantIdRef = useRef(null);
  const messageQueueRef = useRef([]);
  /** Payload awaiting a server reply (stream_start / done / error). */
  const pendingPayloadRef = useRef(null);
  const conversationIdRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vesela_active_conversation_id");
      if (saved) {
        conversationIdRef.current = saved;
      }
    }
  }, []);

  const onMessageRef = useRef(null);
  const connectRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLocked, setIsLocked] = useState(() => {
    if (isPro) return false;
    return readAuthLimitLocked();
  });

  const isProRef = useRef(isPro);

  useEffect(() => {
    userIdRef.current = userId;
    tokenRef.current = token;
    isProRef.current = isPro;
  }, [userId, token, isPro]);

  useEffect(() => {
    if (isPro && isLocked) {
      setIsLocked(false);
    }
  }, [isPro, isLocked]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isPro || !isLocked) {
      localStorage.removeItem(AUTH_LIMIT_LOCKED);
      return;
    }
    localStorage.setItem(AUTH_LIMIT_LOCKED, utcDateString());
  }, [isLocked, isPro]);

  // Backend free-plan cap resets at UTC midnight; drop a stale same-day lock then.
  useEffect(() => {
    if (typeof window === "undefined" || isPro) return;

    const unlockIfNewUtcDay = () => {
      if (localStorage.getItem(AUTH_LIMIT_LOCKED) !== utcDateString()) {
        setIsLocked(false);
      }
    };

    const timer = setTimeout(() => setIsLocked(false), msUntilNextUtcMidnight());

    const onVisible = () => {
      if (document.visibilityState === "visible") unlockIfNewUtcDay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isPro]);

  const clearPendingReply = useCallback(() => {
    pendingPayloadRef.current = null;
  }, []);

  const acknowledgeServerReply = useCallback(() => {
    clearPendingReply();
    retryCountRef.current = 0;
  }, [clearPendingReply]);

  const removeIncompleteAssistantBubble = useCallback(() => {
    const assistantId = currentAssistantIdRef.current;
    if (!assistantId) return;
    currentAssistantIdRef.current = null;
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === assistantId);
      if (idx === -1) return prev;
      if (prev[idx].message?.trim()) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const requeuePendingPayload = useCallback(() => {
    const payload = pendingPayloadRef.current;
    if (!payload) return;
    const alreadyQueued = messageQueueRef.current.some(
      (item) => item.text === payload.text && item.user_id === payload.user_id,
    );
    if (!alreadyQueued) {
      messageQueueRef.current.unshift(payload);
    }
  }, []);

  const scheduleReconnect = useCallback((immediate = false) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return;
    }
    clearTimeout(retryTimerRef.current);
    const delay = immediate
      ? 0
      : Math.min(
          BASE_BACKOFF_MS * 2 ** retryCountRef.current + Math.random() * 500,
          30_000,
        );
    retryCountRef.current += 1;
    retryTimerRef.current = setTimeout(() => connectRef.current?.(), delay);
  }, []);

  const closeSocket = useCallback((clearQueue = false) => {
    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;

    const ws = socketRef.current;
    if (ws) {
      ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
      try {
        ws.close(1000);
      } catch {
        /* ignore */
      }
      socketRef.current = null;
    }

    if (clearQueue) {
      messageQueueRef.current = [];
      pendingPayloadRef.current = null;
      currentAssistantIdRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  /** Mimics the useful part of a page refresh: fresh access token + clean socket. */
  const hardReconnect = useCallback(async () => {
    retryCountRef.current = 0;
    closeSocket(false);

    try {
      const newToken = await refreshAccessToken({ force: true });
      tokenRef.current = newToken;
    } catch {
      // Network or refresh may fail briefly — still attempt socket with existing token.
    }

    connectRef.current?.();
  }, [closeSocket]);

  const failPendingReply = useCallback((message) => {
    acknowledgeServerReply();
    setIsStreaming(false);
    removeIncompleteAssistantBubble();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "assistant", message, isError: true },
    ]);
  }, [acknowledgeServerReply, removeIncompleteAssistantBubble]);

  const handleMessage = useCallback((event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      console.warn("[WS] Unparseable message payload:", event.data);
      return;
    }

    if (SILENT_TYPES.has(data.type)) {
      return;
    }

    if (data.conversation_id && data.conversation_id !== conversationIdRef.current) {
      conversationIdRef.current = data.conversation_id;
      if (typeof window !== "undefined") {
        localStorage.setItem("vesela_active_conversation_id", data.conversation_id);
      }
    }

    if (data.daily_limit_reached === true && !isProRef.current) {
      setIsLocked(true);
    }

    switch (data.type) {
      case "thinking":
        acknowledgeServerReply();
        setIsStreaming(true);
        break;

      case "stream_start":
        acknowledgeServerReply();
        setIsStreaming(true);
        {
          const id = crypto.randomUUID();
          currentAssistantIdRef.current = id;
          setMessages((prev) => [
            ...prev,
            { id, role: "assistant", message: "" },
          ]);
        }
        break;

      case "chunk":
        if (currentAssistantIdRef.current && data.content) {
          setMessages((prev) => {
            const idx = prev.findIndex(
              (m) => m.id === currentAssistantIdRef.current,
            );
            if (idx === -1) return prev;
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              message: next[idx].message + data.content,
            };
            return next;
          });
        }
        break;

      case "done":
      case "complete":
        acknowledgeServerReply();
        setIsStreaming(false);
        currentAssistantIdRef.current = null;
        if (data.daily_limit_reached !== true) {
          setIsLocked(false);
        }
        break;

      case "error": {
        acknowledgeServerReply();
        setIsStreaming(false);
        currentAssistantIdRef.current = null;
        const msg = data.message || "An error occurred.";

        if (isConversationExpiredError(data)) {
          conversationIdRef.current = null;
          clearActiveConversation();
          // Show server message as a normal assistant bubble (not isError — no "Something failed.").
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", message: msg },
          ]);
          break;
        }

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", message: msg, isError: true },
        ]);
        break;
      }

      default:
        console.debug("[WS] Unknown message type:", data.type, data);
    }
  }, [acknowledgeServerReply]);

  useEffect(() => {
    onMessageRef.current = handleMessage;
  }, [handleMessage]);

  const disconnect = useCallback(
    (clearQueue = false) => {
      closeSocket(clearQueue);
      setStatus("disconnected");
    },
    [closeSocket],
  );

  const flushMessageQueue = useCallback((ws) => {
    while (messageQueueRef.current.length > 0) {
      const payload = messageQueueRef.current.shift();
      if (conversationIdRef.current && !payload.conversation_id) {
        payload.conversation_id = conversationIdRef.current;
      }
      ws.send(JSON.stringify(payload));
    }
  }, []);

  const recoverAuthAndReconnect = useCallback(async () => {
    if (isAuthRecoveringRef.current) return;
    isAuthRecoveringRef.current = true;

    try {
      const newToken = await refreshAccessToken({ force: true });
      tokenRef.current = newToken;
      closeSocket(false);
      connectRef.current?.();
    } catch {
      handleAuthFailure();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } finally {
      isAuthRecoveringRef.current = false;
    }
  }, [closeSocket]);

  const connect = useCallback(() => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      recoverAuthAndReconnect();
      return;
    }
    if (isDisposedRef.current) {
      return;
    }

    const old = socketRef.current;
    if (old?.readyState === WebSocket.OPEN) {
      return;
    }
    if (old) {
      old.onopen = old.onmessage = old.onclose = old.onerror = null;
      try {
        old.close();
      } catch {
        /* ignore */
      }
      socketRef.current = null;
    }

    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;

    setStatus("connecting");

    try {
      const url = `${WS_URL}?token=${encodeURIComponent(currentToken)}`;
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        if (isDisposedRef.current) {
          ws.close();
          return;
        }
        if (!pendingPayloadRef.current) {
          retryCountRef.current = 0;
        }
        setConnectionFailed(false);
        setStatus("connected");
        flushMessageQueue(ws);
      };

      ws.onmessage = (event) => {
        onMessageRef.current?.(event);
      };

      ws.onclose = (event) => {
        if (isDisposedRef.current) {
          return;
        }
        socketRef.current = null;
        setStatus("disconnected");

        const { code, reason } = event;
        console.warn(`[WS] Closed — code=${code}, reason=${reason || "none"}`);

        const hasPendingReply = Boolean(pendingPayloadRef.current);

        if (code === 4001) {
          if (hasPendingReply) {
            removeIncompleteAssistantBubble();
            requeuePendingPayload();
            setIsStreaming(true);
          }
          recoverAuthAndReconnect();
          return;
        }

        if (code >= 4000 && code < 5000) {
          if (hasPendingReply) {
            failPendingReply("Unable to connect. Please try sending your message again.");
          } else {
            handleAuthFailure();
          }
          return;
        }

        if (code === 1000) {
          if (!hasPendingReply) {
            currentAssistantIdRef.current = null;
            setIsStreaming(false);
          }
          return;
        }

        // Retryable disconnect — silently reconnect and resend pending message.
        if (RETRYABLE_CODES.has(code) || code === 0) {
          if (hasPendingReply) {
            removeIncompleteAssistantBubble();
            requeuePendingPayload();
            setIsStreaming(true);

            // Same token + socket after sleep often fails (DNS/network not ready).
            // Periodically refresh the session like a page reload would.
            if (retryCountRef.current >= MAX_PENDING_RETRIES) {
              failPendingReply("Unable to connect. Please try sending your message again.");
              setConnectionFailed(true);
              return;
            }

            if (
              retryCountRef.current > 0 &&
              retryCountRef.current % HARD_RECONNECT_EVERY === 0
            ) {
              hardReconnect();
              return;
            }

            scheduleReconnect(retryCountRef.current === 0);
            return;
          }

          currentAssistantIdRef.current = null;
          setIsStreaming(false);
          if (retryCountRef.current >= MAX_IDLE_RETRIES) {
            setConnectionFailed(true);
            return;
          }
          scheduleReconnect(false);
          return;
        }

        if (hasPendingReply) {
          // Non-retryable close with a pending message — try hard reconnect once.
          hardReconnect();
        }
      };

      ws.onerror = () => {
        /* onclose handles recovery */
      };
    } catch (err) {
      console.error("[WS] Error creating WebSocket instance:", err);
      setStatus("disconnected");
    }
  }, [flushMessageQueue, recoverAuthAndReconnect, removeIncompleteAssistantBubble, requeuePendingPayload, scheduleReconnect, hardReconnect, failPendingReply]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleActivity = () => {
      const needsReconnect =
        tokenRef.current &&
        (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED);

      if (!needsReconnect) return;

      // Tab focus / network back — reset backoff (page reload would do this too).
      retryCountRef.current = 0;
      connectRef.current?.();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleActivity();
      }
    };

    window.addEventListener("online", handleActivity);
    window.addEventListener("focus", handleActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleActivity);
      window.removeEventListener("focus", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const prevToken = prevTokenRef.current;
    prevTokenRef.current = token;

    if (!token) {
      isDisposedRef.current = true;
      disconnect(true);
      return;
    }

    isDisposedRef.current = false;

    if (prevToken && prevToken !== token) {
      // Token rotation after refresh — reconnect without wiping chat or queue.
      retryCountRef.current = 0;
      closeSocket(false);
      queueMicrotask(() => connect());
      return () => {
        isDisposedRef.current = true;
        disconnect(false);
      };
    }

    retryCountRef.current = 0;
    queueMicrotask(() => connect());

    return () => {
      isDisposedRef.current = true;
      disconnect(false);
    };
  }, [token, connect, disconnect, closeSocket]);

  const sendMessage = useCallback(
    (text) => {
      if (!text?.trim()) return;

      const payload = {
        user_id: userIdRef.current,
        text: text.trim(),
        conversation_id: conversationIdRef.current,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      pendingPayloadRef.current = payload;
      retryCountRef.current = 0;

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", message: text.trim() },
      ]);
      setIsStreaming(true);

      const ws = socketRef.current;
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        return;
      }

      messageQueueRef.current.push(payload);
      connect();
    },
    [connect],
  );

  const handleUserReconnect = useCallback(() => {
    retryCountRef.current = 0;
    setConnectionFailed(false);
    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;
    closeSocket(false);

    if (!tokenRef.current) {
      recoverAuthAndReconnect();
    } else {
      connect();
    }
  }, [closeSocket, connect, recoverAuthAndReconnect]);

  return {
    messages,
    sendMessage,
    status,
    isConnected: status === "connected",
    isStreaming,
    isLocked,
    connectionFailed,
    reconnect: handleUserReconnect,
  };
};
