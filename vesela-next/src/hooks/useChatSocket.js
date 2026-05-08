"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { TOKEN, USER_DETAILS } from "@/constant";

const STREAM_SPEED = 8;

export const useChatSocket = (enabled = false) => {
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);
  const messageQueueRef = useRef([]);
  const hasConnectedRef = useRef(false);

  const streamBufferRef = useRef("");
  const animationFrameRef = useRef(null);
  const currentAssistantMsgRef = useRef("");
  const conversationIdRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // ✅ ONLY FOR AUTH USERS
  const token = enabled ? localStorageUtil.get(TOKEN) : null;

  let userId = null;
  try {
    const user = localStorageUtil.get(USER_DETAILS);
    userId = user?.pk;
  } catch {}

  // ---------------- SOCKET ----------------
  const connectSocket = useCallback(() => {
    if (!enabled) return;
    if (!token) return;

    const socket = new WebSocket(
      `wss://portal.grayskyai.com/ws/chat/?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);

      messageQueueRef.current.forEach((msg) =>
        socket.send(JSON.stringify(msg))
      );
      messageQueueRef.current = [];
    };

    socket.onclose = () => {
      setIsConnected(false);
      socketRef.current = null;

      reconnectRef.current = setTimeout(connectSocket, 3000);
    };

    socket.onerror = () => socket.close();

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "thinking":
          setIsThinking(true);
          break;

        case "stream_start":
          setIsThinking(false);
          setIsTyping(true);

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
          break;
      }
    };
  }, [enabled, token]);

  // ---------------- INIT ----------------
  useEffect(() => {
    if (!enabled || !token || hasConnectedRef.current) return;

    hasConnectedRef.current = true;
    connectSocket();

    return () => {
      socketRef.current?.close(1000);
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
  };
};