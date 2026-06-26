"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const WS_URL = "wss://portal.grayskyai.com/ws/chat/";

// Close codes that are worth retrying (transient / network errors)
const RETRYABLE_CODES = new Set([1001, 1006, 1011, 1012, 1013, 1014]);
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

// Message types that carry no content and must never touch UI state
const SILENT_TYPES = new Set(["ping", "pong", "heartbeat", "keepalive"]);

// ─── Limit-reached detector ──────────────────────────────────────────────────

const LIMIT_PHRASES = [
  "Your 20 free messages will reset",
  "upgrading to the Pro subscription",
  "Thanks so much for chatting with Vesela today",
];

function isLimitMessage(text) {
  return LIMIT_PHRASES.some((phrase) => text.includes(phrase));
}
export const useChatSocket = (token, userId) => {
  // ─── Refs ──────────────────────────────────────────────────────────────────
  const socketRef = useRef(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);
  const isDisposedRef = useRef(false);
  const userIdRef = useRef(userId);
  const tokenRef = useRef(token);

  const currentAssistantIdRef = useRef(null);
  const messageQueueRef = useRef([]);
  const conversationIdRef = useRef(null);
  const onMessageRef = useRef(null);
  const connectRef = useRef(null);

  // ─── State ─────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("vesela_auth_limit_locked") === "true";
  });

  // Keep refs in sync with latest prop values outside of render
  useEffect(() => {
    userIdRef.current = userId;
    tokenRef.current = token;
  }, [userId, token]);

  // ─── Persist locked flag ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLocked) {
      localStorage.setItem("vesela_auth_limit_locked", "true");
    } else {
      localStorage.removeItem("vesela_auth_limit_locked");
    }
  }, [isLocked]);

  // ─── Message handler ───────────────────────────────────────────────────────

  const handleMessage = useCallback((event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      console.warn("[WS] Unparseable message payload:", event.data);
      return;
    }

    if (SILENT_TYPES.has(data.type)) {
      console.log(`[WS] Received silent message type: "${data.type}"`);
      return;
    }

    console.log(`[WS] Processing message type: "${data.type}"`, data);

    switch (data.type) {
      case "thinking":
        setIsStreaming(true);
        break;

      case "stream_start":
        // A new assistant turn is beginning.
        setIsStreaming(true);
        if (data.conversation_id) {
          conversationIdRef.current = data.conversation_id;
          console.log("[WS] Set conversationId:", data.conversation_id);
        }
        // Insert an empty assistant bubble to stream into.
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
        // Append chunk directly to the current assistant bubble.
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
        } else {
          console.warn("[WS] Received chunk but no currentAssistantId or content", data);
        }
        break;

      case "done":
      case "complete":
        // Stream finished — this is the ONLY place we hide the loader.
        console.log(`[WS] Stream completed for message type: "${data.type}"`);
        setIsStreaming(false);
        currentAssistantIdRef.current = null;
        break;

      case "error": {
        console.error("[WS] Received error message:", data);
        setIsStreaming(false);
        currentAssistantIdRef.current = null;
        const msg = data.message || "An error occurred.";
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", message: msg, isError: true },
        ]);
        if (isLimitMessage(msg)) {
          console.warn("[WS] User limit message detected. Locking chat.");
          setIsLocked(true);
        }
        break;
      }

      default:
        // Unknown type — log and ignore to prevent UI noise
        console.debug("[WS] Unknown message type:", data.type, data);
    }
  }, []); // no deps — reads no state; all mutations are via setter functions

  // Keep the message handler ref in sync
  useEffect(() => {
    onMessageRef.current = handleMessage;
  }, [handleMessage]);

  // ─── Connect / Disconnect ──────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;

    const ws = socketRef.current;
    if (ws) {
      ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
      try { ws.close(1000); } catch { /* ignore */ }
      socketRef.current = null;
    }

    messageQueueRef.current = [];
    currentAssistantIdRef.current = null;
    setStatus("disconnected");
    setIsStreaming(false);
  }, []);

  const connect = useCallback(() => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      console.log("[WS] Connection skipped: No token available.");
      return;
    }
    if (isDisposedRef.current) {
      console.log("[WS] Connection skipped: Hook is disposed.");
      return;
    }

    // Close any existing socket cleanly before reconnecting
    const old = socketRef.current;
    if (old) {
      if (old.readyState === WebSocket.CONNECTING || old.readyState === WebSocket.OPEN) {
        console.log(`[WS] Connection already in progress or open (readyState: ${old.readyState}). Skipping connect.`);
        return;
      }
      console.log("[WS] Closing existing closed/closing socket before reconnecting.");
      old.onopen = old.onmessage = old.onclose = old.onerror = null;
      try { old.close(); } catch (err) { console.error("[WS] Error closing stale socket:", err); }
      socketRef.current = null;
    }

    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;

    setStatus("connecting");
    console.log(`[WS] Connecting to ${WS_URL}...`);

    try {
      const ws = new WebSocket(`${WS_URL}?token=${currentToken}`);
      socketRef.current = ws;

      ws.onopen = () => {
        if (isDisposedRef.current) {
          console.log("[WS] Socket opened but hook is disposed. Closing socket.");
          return ws.close();
        }
        retryCountRef.current = 0;
        setStatus("connected");
        console.log("[WS] Connection successfully established.");

        currentAssistantIdRef.current = null;
        console.log(`[WS] Draining message queue. Queue length: ${messageQueueRef.current.length}`);
        while (messageQueueRef.current.length > 0) {
          const payload = messageQueueRef.current.shift();
          console.log("[WS] Sending queued message payload:", payload);
          ws.send(JSON.stringify(payload));
        }
      };

      ws.onmessage = (event) => {
        console.log("[WS] Received raw message:", event.data);
        onMessageRef.current?.(event);
      };

      ws.onclose = (event) => {
        if (isDisposedRef.current) {
          console.log("[WS] Socket closed (hook disposed).");
          return;
        }
        socketRef.current = null;
        currentAssistantIdRef.current = null;
        setStatus("disconnected");

        setIsStreaming((prev) => {
          if (prev) {
            console.log("[WS] Connection lost during streaming. Appending error message.");
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

        // Auth failure codes: stop reconnecting immediately
        if (code >= 4000 && code < 5000) {
          console.warn("[WS] Auth/server rejected — will not reconnect. Code:", code);
          return;
        }

        // Clean close: do not reconnect
        if (code === 1000) return;

        // For non-retryable codes stop after logging
        if (!RETRYABLE_CODES.has(code) && code !== 0) {
          console.warn("[WS] Non-retryable close code:", code);
          return;
        }

        // Exponential backoff with jitter
        if (retryCountRef.current >= MAX_RETRIES) {
          console.warn("[WS] Max retries reached. Giving up.");
          return;
        }

        const delay = Math.min(
          BASE_BACKOFF_MS * 2 ** retryCountRef.current + Math.random() * 500,
          30_000,
        );
        retryCountRef.current += 1;
        console.log(`[WS] Reconnecting in ${Math.round(delay)}ms (attempt ${retryCountRef.current}/${MAX_RETRIES})`);

        retryTimerRef.current = setTimeout(() => connectRef.current?.(), delay);
      };

      ws.onerror = (err) => {
        console.error("[WS] Socket error occurred:", err);
      };
    } catch (err) {
      console.error("[WS] Error creating WebSocket instance:", err);
      setStatus("disconnected");
    }
  }, []);

  // Keep connect ref in sync
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => {
        disconnect();
        setMessages([]);
        setIsLocked(false);
      });
      conversationIdRef.current = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("vesela_auth_limit_locked");
      }
      return;
    }

    isDisposedRef.current = false;
    retryCountRef.current = 0;
    queueMicrotask(() => {
      connect();
    });

    return () => {
      isDisposedRef.current = true;
      disconnect();
    };
  }, [token, connect, disconnect]);

  // ─── Send ──────────────────────────────────────────────────────────────────

  const sendMessage = useCallback((text) => {
    if (!text?.trim()) {
      console.warn("[WS] Attempted to send empty message. Ignored.");
      return;
    }

    const payload = {
      user_id: userIdRef.current,
      text: text.trim(),
      conversation_id: conversationIdRef.current,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    console.log(`[WS] sendMessage called with text: "${text.trim()}"`);

    // Optimistically add the user message to the UI
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", message: text.trim() },
    ]);

    // Show loader immediately — do not wait for the WS event
    setIsStreaming(true);

    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      console.log("[WS] Socket is OPEN. Sending payload immediately.");
      ws.send(JSON.stringify(payload));
    } else {
      const stateString = ws ? `readyState: ${ws.readyState}` : "null";
      console.log(`[WS] Socket is not open (${stateString}). Queuing message and initiating connection.`);
      // Queue and (re)connect — the queue is drained in onopen
      messageQueueRef.current.push(payload);
      connect();
    }
    // connect is stable (no deps), so this callback is stable too
  }, [connect]);

  return {
    messages,
    sendMessage,
    status,
    isConnected: status === "connected",
    isStreaming,
    isLocked,
  };
};