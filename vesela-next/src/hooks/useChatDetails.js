"use client";

import { get } from "@/lib/apiService";
import { useState, useEffect, useCallback } from "react"; 

export const useChatDetails = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChatHistory = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { status, data } = await get(`/api/chats/${chatId}/`);
      
      if (status === 200) {
        const formattedMessages = data?.Chats
          ?.filter((item) => item?.content?.trim())
          .map((item) => ({
            id: item.date || Math.random().toString(),
            sender: item?.role?.toLowerCase() === "assistant" ? "assistant" : "user",
            text: item.content,
          })) || [];
        
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chat history:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  return { messages, loading, error, refresh: fetchChatHistory };
};