"use client";

import { TOKEN, USER_DETAILS } from "@/constant";
import { useEffect, useRef, useState } from "react";

export const useChatSocket = () => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const hasConnectedRef = useRef(false);
  const messageQueueRef = useRef([]); // ✅ queue for messages

  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const conversationIdRef = useRef(null);
  const currentAssistantMsgRef = useRef("");

  // ✅ Token
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(TOKEN)
      : null;

  // ✅ User
  let userId = null;
  if (typeof window !== "undefined" && token) {
    try {
      const user = JSON.parse(localStorage.getItem(USER_DETAILS));
      userId = user?.pk;
    } catch {
      console.error("Invalid USER_DETAILS JSON");
    }
  }

  // 🔌 CONNECT FUNCTION
  const connectSocket = () => {
    if (!token) return;

    // ❗ Prevent duplicate connections
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      return;
    }

    console.log("🔌 Connecting WebSocket...");

    const socket = new WebSocket(
      `wss://portal.grayskyai.com/ws/chat/?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected");
      setIsConnected(true);

      // 🚀 Flush queued messages
      if (messageQueueRef.current.length > 0) {
        messageQueueRef.current.forEach((msg) => {
          socket.send(JSON.stringify(msg));
        });
        messageQueueRef.current = [];
      }
    };

    socket.onerror = (event) => {
      console.error("🚨 WebSocket error:", event);
      console.log("ReadyState:", socket.readyState);
    };

    socket.onclose = (event) => {
      console.log("❌ Disconnected");
      console.log("Code:", event.code);
      console.log("Reason:", event.reason);

      setIsConnected(false);
      socketRef.current = null;

      // 🔁 Auto reconnect (avoid infinite loop on 1006)
      if (event.code !== 1000 && event.code !== 1006) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSocket();
        }, 3000);
      }
    };

    socket.onmessage = (event) => {
      let data;

      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        case "thinking":
          setIsThinking(true);
          break;

        case "stream_start":
          setIsThinking(false);
          setIsTyping(true);
          currentAssistantMsgRef.current = "";

          setMessages((prev) => [
            ...prev,
            { role: "assistant", message: "" },
          ]);
          break;

        case "chunk":
          currentAssistantMsgRef.current += data.content;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              message: currentAssistantMsgRef.current,
            };
            return updated;
          });
          break;

        case "done":
          setIsTyping(false);
          setIsThinking(false);

          if (data.conversation_id) {
            conversationIdRef.current = data.conversation_id;
          }
          break;

        case "error":
          setIsTyping(false);
          setIsThinking(false);

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              message: data.message || "Something went wrong",
            },
          ]);
          break;

        default:
          break;
      }
    };
  };

  // 🧠 INIT (Strict Mode safe)
  useEffect(() => {
    if (!token || hasConnectedRef.current) return;

    hasConnectedRef.current = true;

    connectSocket();

    return () => {
      console.log("🧹 Cleaning up socket");

      const socket = socketRef.current;

      // ✅ Only close if OPEN (fixes your main bug)
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "Component unmounted");
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      socketRef.current = null;
    };
  }, [token]);

  // 📤 SEND MESSAGE (FIXED)
  const sendMessage = (text) => {
    if (!text?.trim()) return;

    const socket = socketRef.current;

    const payload = {
      user_id: userId,
      text,
      conversation_id: conversationIdRef.current,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // ✅ Show instantly in UI
    setMessages((prev) => [
      ...prev,
      { role: "user", message: text },
    ]);

    // ❗ If socket not ready → queue
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("⏳ Socket not ready → queueing message");

      messageQueueRef.current.push(payload);

      // 🔥 Try reconnect if socket is null
      if (!socketRef.current) {
        connectSocket();
      }

      return;
    }

    try {
      socket.send(JSON.stringify(payload));
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
    isTyping,
    isThinking,
  };
};