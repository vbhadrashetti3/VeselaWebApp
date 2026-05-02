"use client";

import { TOKEN, USER_DETAILS } from "@/constant";
import { useEffect, useRef, useState } from "react";

export const useChatSocket = () => {
  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const conversationIdRef = useRef(null);
  const currentAssistantMsgRef = useRef("");
  
  const token =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null; 
  
  const userdetails = typeof window !== "undefined" && token ? JSON.parse(localStorage.getItem(USER_DETAILS)) : null;    
  
  const userId = userdetails?.pk

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(
      `wss://portal.grayskyai.com/ws/chat/?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
       console.log("✅ Connected");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log("❌ Disconnected");
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

    return () => socket.close();
  }, [token]);

  const sendMessage = (text) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    setMessages((prev) => [...prev, { role: "user", message: text }]);

    socketRef.current.send(
      JSON.stringify({
        user_id: userId, // ✅ FIXED
        text,
        conversation_id: conversationIdRef.current,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
  };

  return {
    messages,
    sendMessage,
    isConnected,
    isTyping,
    isThinking,
  };
};