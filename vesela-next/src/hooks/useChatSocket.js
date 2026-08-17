"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  refreshAccessToken,
  handleAuthFailure,
} from "@/lib/tokenManager";

// ─── Constants ────────────────────────────────────────────────────────────────

const WS_URL = "wss://portal.grayskyai.com/ws/chat/";

const RETRYABLE_CODES = new Set([1001, 1006, 1011, 1012, 1013, 1014]);
const BASE_BACKOFF_MS = 1000;

const SILENT_TYPES = new Set(["ping", "pong", "heartbeat", "keepalive"]);

export const useChatSocket = (token, userId) => {
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("vesela_auth_limit_locked") === "true";
  });

  useEffect(() => {
    userIdRef.current = userId;
    tokenRef.current = token;
  }, [userId, token]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLocked) {
      localStorage.setItem("vesela_auth_limit_locked", "true");
    } else {
      localStorage.removeItem("vesela_auth_limit_locked");
    }
  }, [isLocked]);

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

    if (data.daily_limit_reached === true) {
      setIsLocked(true);
    }

    switch (data.type) {
      case "thinking":
        setIsStreaming(true);
        break;

      case "stream_start":
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
        setIsStreaming(false);
        currentAssistantIdRef.current = null;
        break;

      case "error": {
        setIsStreaming(false);
        currentAssistantIdRef.current = null;
        const msg = data.message || "An error occurred.";
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", message: msg, isError: true },
        ]);
        break;
      }

      default:
        console.debug("[WS] Unknown message type:", data.type, data);
    }
  }, []);

  useEffect(() => {
    onMessageRef.current = handleMessage;
  }, [handleMessage]);

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
    }
    currentAssistantIdRef.current = null;
    setIsStreaming(false);
  }, []);

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
        retryCountRef.current = 0;
        setStatus("connected");
        currentAssistantIdRef.current = null;
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
        currentAssistantIdRef.current = null;
        setStatus("disconnected");

        setIsStreaming((prev) => {
          if (prev) {
            setMessages((msgs) => {
              const last = msgs[msgs.length - 1];
              if (last?.isError) return msgs;
              return [
                ...msgs,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  message: "Connection lost. Please retry.",
                  isError: true,
                },
              ];
            });
          }
          return false;
        });

        const { code, reason } = event;
        console.warn(`[WS] Closed — code=${code}, reason=${reason || "none"}`);

        if (code === 4001) {
          recoverAuthAndReconnect();
          return;
        }

        if (code >= 4000 && code < 5000) {
          handleAuthFailure();
          return;
        }

        if (code === 1000) return;

        if (!RETRYABLE_CODES.has(code) && code !== 0) {
          return;
        }

        const delay = Math.min(
          BASE_BACKOFF_MS * 2 ** retryCountRef.current + Math.random() * 500,
          30_000,
        );
        retryCountRef.current += 1;
        retryTimerRef.current = setTimeout(() => connectRef.current?.(), delay);
      };

      ws.onerror = () => {
        /* onclose handles recovery */
      };
    } catch (err) {
      console.error("[WS] Error creating WebSocket instance:", err);
      setStatus("disconnected");
    }
  }, [flushMessageQueue, recoverAuthAndReconnect]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleActivity = () => {
      if (tokenRef.current && (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED)) {
        retryCountRef.current = 0;
        connectRef.current?.();
      }
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
    reconnect: handleUserReconnect,
  };
};
