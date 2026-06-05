"use client";

import { useState, useCallback, useEffect } from "react"; 
import { get } from "@/lib/apiService";

export const useChatHistory = (open) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChatHistory = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    setError(null);
    
    try {
      const { status, data } = await get("/api/conversations/");
      
      if (status === 200) {
        const sortedChats = data?.Conversations?.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ) || [];

        setChatHistory(sortedChats);

        // Auto-select logic: if nothing is selected, pick the latest chat
        if (sortedChats.length > 0 && !selectedChatId) {
          setSelectedChatId(sortedChats[0].id);
        }
      }
    } catch (err) {
      console.error("❌ Failed to load conversations:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [open, selectedChatId]);

  // Re-fetch whenever the 'open' state changes to true
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChatHistory();
  }, [fetchChatHistory]);

  return {
    chatHistory,
    selectedChatId,
    setSelectedChatId,
    loading,
    error,
    refresh: fetchChatHistory
  };
};