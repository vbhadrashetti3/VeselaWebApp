"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { TOKEN, USER_DETAILS } from "@/constant";

const STREAM_SPEED = 8;

export const useChatSocket = (enabled = false) => {
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);
  const messageQueueRef = useRef([]);
  const isDisposedRef = useRef(false);

  const streamBufferRef = useRef("");
  const animationFrameRef = useRef(null);
  const currentAssistantMsgRef = useRef("");
  const conversationIdRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const connectSocketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("vesela_auth_limit_locked") === "true";
  });

  // ✅ ONLY FOR AUTH USERS
  const token = enabled ? localStorageUtil.get(TOKEN) : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLocked) {
      window.localStorage.setItem("vesela_auth_limit_locked", "true");
    } else {
      window.localStorage.removeItem("vesela_auth_limit_locked");
    }
  }, [isLocked]);

  useEffect(() => {
    if (!enabled) {
      setIsLocked(false);
      setIsConnected(false);
      setIsTyping(false);
      setIsThinking(false);
      setMessages([]);
      conversationIdRef.current = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("vesela_auth_limit_locked");
      }
    }
  }, [enabled]);

  let userId = null;
  try {
    const user = localStorageUtil.get(USER_DETAILS);
    userId = user?.pk;
  } catch { }

  // ---------------- SOCKET ----------------
  const connectSocket = useCallback(() => {
    if (!enabled) return;
    if (!token) return;

    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }

    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch {}
    }

    const socket = new WebSocket(
      `wss://portal.grayskyai.com/ws/chat/?token=${token}`
    );

    socketRef.current = socket;

    let heartbeatInterval = null;

    socket.onopen = () => {
      setIsConnected(true);

      // Start keepalive heartbeat
      heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 20000);

      messageQueueRef.current.forEach((msg) =>
        socket.send(JSON.stringify(msg))
      );
      messageQueueRef.current = [];
    };

    socket.onclose = () => {
      setIsConnected(false);
      socketRef.current = null;
      if (heartbeatInterval) clearInterval(heartbeatInterval);

      if (isDisposedRef.current) return;

      reconnectRef.current = setTimeout(() => {
        connectSocketRef.current?.();
      }, 3000);
    };

    socket.onerror = () => {
      try {
        socket.close();
      } catch {}
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "pong") return;

      switch (data.type) {
        case "thinking":
          setIsThinking(true);
          break;

        case "stream_start":
          setIsThinking(false);
          setIsTyping(true);

          if (data.conversation_id) {
            conversationIdRef.current = data.conversation_id;
          }

          currentAssistantMsgRef.current = "";
          streamBufferRef.current = "";

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              message: "",
            },
          ]);
          break;

        case "chunk":
          streamBufferRef.current += data.content;

          if (!isAnimatingRef.current) {
            isAnimatingRef.current = true;

            const animate = () => {
              if (!streamBufferRef.current.length) {
                isAnimatingRef.current = false;
                return;
              }

              const chunk = streamBufferRef.current.slice(
                0,
                STREAM_SPEED
              );

              streamBufferRef.current =
                streamBufferRef.current.slice(STREAM_SPEED);

              currentAssistantMsgRef.current += chunk;

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].message =
                  currentAssistantMsgRef.current;
                return updated;
              });

              requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
          }
          break;

        case "done":
          setIsTyping(false);
          setIsThinking(false);

          break;

        case "error":
          setIsTyping(false);
          setIsThinking(false);

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              message: data.message || "Error",
              isError: true,
            },
          ]);

          const finalMsg = data.message || "";
          const isLimitReached =
            finalMsg.includes("Your 20 free messages will reset") ||
            finalMsg.includes("upgrading to the Pro subscription") ||
            finalMsg.includes("Thanks so much for chatting with Vesela today");

          if (isLimitReached) {
            setIsLocked(true);
          }
          break;
      }
    };
  }, [enabled, token]);

  // Keep connectSocketRef updated with the latest callback
  useEffect(() => {
    connectSocketRef.current = connectSocket;
  }, [connectSocket]);

  // ---------------- INIT ----------------
  useEffect(() => {
    if (!enabled || !token) return;

    isDisposedRef.current = false;
    connectSocket();

    return () => {
      isDisposedRef.current = true;
      socketRef.current?.close(1000);
      socketRef.current = null;
      clearTimeout(reconnectRef.current);
    };
  }, [enabled, token, connectSocket]);

  // ---------------- SEND ----------------
  const sendMessage = useCallback(
    (text) => {
      if (!text?.trim()) return;

      const payload = {
        user_id: userId,
        text,
        conversation_id: conversationIdRef.current,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", message: text },
      ]);

      setIsThinking(true);

      const socket = socketRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        messageQueueRef.current.push(payload);
        connectSocket();
        return;
      }

      socket.send(JSON.stringify(payload));
    },
    [userId, connectSocket]
  );

  return {
    messages,
    sendMessage,
    isConnected,
    isTyping,
    isThinking,
    isLocked,
  };
};