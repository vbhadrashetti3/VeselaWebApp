"use client";

import { useEffect, useRef, useState } from "react";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { TOKEN, USER_DETAILS } from "@/constant";

export const useChatSocket = () => {
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);
  const messageQueueRef = useRef([]);
  const hasConnectedRef = useRef(false);
  const conversationIdRef = useRef(null);
  const currentAssistantMsgRef = useRef("");

  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const token = localStorageUtil.get(TOKEN);

  let userId = null;
  try {
    const user = localStorageUtil.get(USER_DETAILS);
    userId = user?.pk;
  } catch {}

  // 🔌 CONNECT
  const connectSocket = () => {
    if (!token) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(
      `wss://portal.grayskyai.com/ws/chat/?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);

      // flush queue
      messageQueueRef.current.forEach((msg) => {
        socket.send(JSON.stringify(msg));
      });
      messageQueueRef.current = [];
    };

    socket.onclose = (e) => {
      setIsConnected(false);
      socketRef.current = null;

      if (e.code !== 1000) {
        reconnectRef.current = setTimeout(connectSocket, 3000);
      }
    };

    socket.onerror = () => {
      socket.close();
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
            { role: "assistant", message: " " },
          ]);
          break;

        case "chunk":

          if (isThinking) setIsThinking(false); 
          currentAssistantMsgRef.current += data.content;

          requestAnimationFrame(() => {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                message: currentAssistantMsgRef.current,
              };
              return updated;
            });
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
              isError: true,
            },
          ]);
          break;
      }
    };
  };

  useEffect(() => {
    if (!token || hasConnectedRef.current) return;

    hasConnectedRef.current = true;

    // load previous messages
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }

    connectSocket();

    return () => {
      socketRef.current?.close(1000);
      clearTimeout(reconnectRef.current);
    };
  }, [token]);

  // persist messages
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // 📤 SEND
  const sendMessage = (text) => {
    if (!text?.trim()) return;

    const payload = {
      user_id: userId,
      text,
      conversation_id: conversationIdRef.current,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    setMessages((prev) => [...prev, { role: "user", message: text }]);


    // ✅ 🔥 ADD THIS (MOST IMPORTANT)
    setIsThinking(true);
    setIsTyping(false);

    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      messageQueueRef.current.push(payload);
      connectSocket();
      return;
    }

    socket.send(JSON.stringify(payload));
  };

  return {
    messages,
    sendMessage,
    isConnected,
    isTyping,
    isThinking,
  };
};