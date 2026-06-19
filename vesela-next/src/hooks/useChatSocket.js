"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const WS_URL = "wss://portal.grayskyai.com/ws/chat/";
const STREAM_SPEED = 8; // characters per animation frame

// Close codes that are worth retrying (transient / network errors)
const RETRYABLE_CODES = new Set([1001, 1006, 1011, 1012, 1013, 1014]);
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

// ─── Limit-reached detector ──────────────────────────────────────────────────

const LIMIT_PHRASES = [
  "Your 20 free messages will reset",
  "upgrading to the Pro subscription",
  "Thanks so much for chatting with Vesela today",
];

function isLimitMessage(text) {
  return LIMIT_PHRASES.some((phrase) => text.includes(phrase));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useChatSocket
 *
 * Manages a WebSocket connection to the Vesela chat backend.
 *
 * @param {string|null} token  – JWT access token. Pass null to stay disconnected.
 * @param {string|null} userId – User's PK, sent with every message payload.
 */
export const useChatSocket = (token, userId) => {
  // ─── Refs ──────────────────────────────────────────────────────────────────
  const socketRef        = useRef(null);
  const retryCountRef    = useRef(0);
  const retryTimerRef    = useRef(null);
  const isDisposedRef    = useRef(false);
  const userIdRef        = useRef(userId);   // always-fresh userId for callbacks
  const tokenRef         = useRef(token);    // always-fresh token for reconnects

  // Streaming animation
  const streamBufferRef        = useRef("");
  const animFrameRef           = useRef(null);
  const currentAssistantMsgRef = useRef("");
  const isAnimatingRef         = useRef(false);
  const isStreamActiveRef      = useRef(false);
  const conversationIdRef      = useRef(null);

  // Message queue: messages sent before the socket was open
  const messageQueueRef  = useRef([]);

  // Stable ref to the onMessage handler so the socket closure never goes stale
  const onMessageRef     = useRef(null);

  // ─── State ─────────────────────────────────────────────────────────────────
  const [messages,   setMessages]   = useState([]);
  const [status,     setStatus]     = useState("disconnected");
  const [isTyping,   setIsTyping]   = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isLocked,   setIsLocked]   = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("vesela_auth_limit_locked") === "true";
  });

  // Keep refs in sync with latest prop values every render
  userIdRef.current = userId;
  tokenRef.current  = token;

  // ─── Persist locked flag ────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLocked) {
      localStorage.setItem("vesela_auth_limit_locked", "true");
    } else {
      localStorage.removeItem("vesela_auth_limit_locked");
    }
  }, [isLocked]);

  // ─── Streaming animation ───────────────────────────────────────────────────

  const startAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const animate = () => {
      if (isDisposedRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      if (!streamBufferRef.current.length) {
        isAnimatingRef.current = false;
        if (!isStreamActiveRef.current) setIsTyping(false);
        return;
      }

      const chunk = streamBufferRef.current.slice(0, STREAM_SPEED);
      streamBufferRef.current = streamBufferRef.current.slice(STREAM_SPEED);
      currentAssistantMsgRef.current += chunk;

      setMessages((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant") {
          last.message = currentAssistantMsgRef.current;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // ─── Message handler ───────────────────────────────────────────────────────

  const handleMessage = useCallback((event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      console.warn("[WS] Unparseable message:", event.data);
      return;
    }

    switch (data.type) {
      case "pong":
        return; // native heartbeat response — ignore silently

      case "thinking":
        setIsThinking(true);
        break;

      case "stream_start":
        setIsThinking(false);
        setIsTyping(true);
        isStreamActiveRef.current = true;
        currentAssistantMsgRef.current = "";
        streamBufferRef.current = "";
        if (data.conversation_id) {
          conversationIdRef.current = data.conversation_id;
        }
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", message: "" },
        ]);
        break;

      case "chunk":
        streamBufferRef.current += data.content ?? "";
        startAnimation();
        break;

      case "done":
        isStreamActiveRef.current = false;
        setIsThinking(false);
        if (!isAnimatingRef.current) setIsTyping(false);
        break;

      case "error": {
        isStreamActiveRef.current = false;
        setIsTyping(false);
        setIsThinking(false);
        const msg = data.message || "An error occurred.";
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", message: msg, isError: true },
        ]);
        if (isLimitMessage(msg)) setIsLocked(true);
        break;
      }

      default:
        // Unknown message type — log and ignore to prevent UI noise
        console.debug("[WS] Unknown message type:", data.type, data);
    }
  }, [startAnimation]);

  // Keep the message handler ref in sync
  useEffect(() => {
    onMessageRef.current = handleMessage;
  }, [handleMessage]);

  // ─── Connect / Disconnect ──────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const ws = socketRef.current;
    if (ws) {
      ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
      try { ws.close(1000); } catch { /* ignore */ }
      socketRef.current = null;
    }

    messageQueueRef.current = [];
    setStatus("disconnected");
    setIsThinking(false);
    setIsTyping(false);
  }, []);

  const connect = useCallback(() => {
    const currentToken = tokenRef.current;
    if (!currentToken || isDisposedRef.current) return;

    // Close any existing socket cleanly before reconnecting
    const old = socketRef.current;
    if (old) {
      old.onopen = old.onmessage = old.onclose = old.onerror = null;
      try { old.close(); } catch { /* ignore */ }
      socketRef.current = null;
    }

    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;

    setStatus("connecting");

    const ws = new WebSocket(`${WS_URL}?token=${currentToken}`);
    socketRef.current = ws;

    ws.onopen = () => {
      if (isDisposedRef.current) return ws.close();
      retryCountRef.current = 0; // reset backoff on successful connect
      setStatus("connected");

      // Drain any messages that were sent while the socket was connecting
      while (messageQueueRef.current.length > 0) {
        const payload = messageQueueRef.current.shift();
        ws.send(JSON.stringify(payload));
      }
    };

    ws.onmessage = (event) => onMessageRef.current?.(event);

    ws.onclose = (event) => {
      if (isDisposedRef.current) return;
      socketRef.current = null;
      setStatus("disconnected");
      setIsThinking(false);
      setIsTyping(false);

      const { code, reason } = event;
      console.debug(`[WS] Closed — code=${code}, reason=${reason || "none"}`);

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
      console.debug(`[WS] Reconnecting in ${Math.round(delay)}ms (attempt ${retryCountRef.current})`);

      retryTimerRef.current = setTimeout(() => connect(), delay);
    };

    ws.onerror = () => {
      // onclose fires immediately after onerror — let it handle reconnect
      console.debug("[WS] Socket error");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // no deps — reads token from ref; connect is stable for its lifetime

  // ─── Init / Teardown ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!token) {
      // Token removed (logout) — disconnect and reset
      disconnect();
      setMessages([]);
      conversationIdRef.current = null;
      setIsLocked(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("vesela_auth_limit_locked");
      }
      return;
    }

    isDisposedRef.current = false;
    retryCountRef.current = 0;
    connect();

    return () => {
      isDisposedRef.current = true;
      disconnect();
    };
  // Reconnect only when token identity changes (login/logout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ─── Send ──────────────────────────────────────────────────────────────────

  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return;

    const payload = {
      user_id: userIdRef.current,
      text: text.trim(),
      conversation_id: conversationIdRef.current,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Optimistically add the user message to the UI
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", message: text.trim() },
    ]);
    setIsThinking(true);

    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    } else {
      // Queue and (re)connect — the queue is drained in onopen
      messageQueueRef.current.push(payload);
      connect();
    }
  // connect is stable (no deps), so this callback is stable too
  }, [connect]);

  // ─── Public API ────────────────────────────────────────────────────────────

  return {
    messages,
    sendMessage,
    status,
    isConnected: status === "connected",
    isTyping,
    isThinking,
    isLocked,
  };
};