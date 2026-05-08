"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { post } from "@/lib/apiService";

const STORAGE_KEYS = {
  pendingHeroMessage: "vesela_pending_hero_message",
  guestMessages: "vesela_guest_messages",
  guestCount: "vesela_guest_count",
  guestKey: "vesela_guest_key",
};

const GUEST_LIMIT = 6;

const ChatSessionContext = createContext(null);

const parseStored = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const ChatSessionProvider = ({ children }) => {
  const [pendingHeroMessage, setPendingHeroMessageState] = useState("");
  const [guestMessages, setGuestMessages] = useState([]);
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const [guestKey, setGuestKey] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState("");

  useEffect(() => {
    setPendingHeroMessageState(parseStored(STORAGE_KEYS.pendingHeroMessage, ""));
    setGuestMessages(parseStored(STORAGE_KEYS.guestMessages, []));
    setGuestMessageCount(parseStored(STORAGE_KEYS.guestCount, 0));
    setGuestKey(parseStored(STORAGE_KEYS.guestKey, ""));
  }, []);

  useEffect(() => setStored(STORAGE_KEYS.pendingHeroMessage, pendingHeroMessage), [pendingHeroMessage]);
  useEffect(() => setStored(STORAGE_KEYS.guestMessages, guestMessages), [guestMessages]);
  useEffect(() => setStored(STORAGE_KEYS.guestCount, guestMessageCount), [guestMessageCount]);
  useEffect(() => setStored(STORAGE_KEYS.guestKey, guestKey), [guestKey]);

  const canSendGuestMessage = guestMessageCount < GUEST_LIMIT;

  const setPendingHeroMessage = useCallback((message) => {
    setPendingHeroMessageState(message?.trim() || "");
  }, []);

  const consumePendingHeroMessage = useCallback(() => {
    const message = pendingHeroMessage?.trim();
    setPendingHeroMessageState("");
    return message;
  }, [pendingHeroMessage]);

  const appendGuestMessage = useCallback((message) => {
    setGuestMessages((prev) => [...prev, message]);
  }, []);

  const sendGuestMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed) return { ok: false, reason: "empty" };
      if (!canSendGuestMessage) return { ok: false, reason: "limit" };

      const userMsgId = Date.now();
      appendGuestMessage({
        id: userMsgId,
        role: "user",
        message: trimmed,
        status: "sent",
      });
      setGuestMessageCount((prev) => prev + 1);
      setGuestLoading(true);
      setGuestError("");

      const body = guestKey ? { text: trimmed, key: guestKey } : { text: trimmed };

      try {
        const { status, data, error } = await post("/api/sales_incoming/", body);
        if (error || status !== 201) {
          appendGuestMessage({
            id: Date.now() + 1,
            role: "assistant",
            message: "I could not answer right now. Please retry.",
            isError: true,
            retryText: trimmed,
          });
          setGuestError("Failed to send guest message.");
          return { ok: false, reason: "api" };
        }

        if (data?.key) setGuestKey(data.key);

        appendGuestMessage({
          id: Date.now() + 2,
          role: "assistant",
          message: data?.response?.text || "Thanks. I am ready for your next question.",
        });
        return { ok: true };
      } catch {
        appendGuestMessage({
          id: Date.now() + 3,
          role: "assistant",
          message: "I could not answer right now. Please retry.",
          isError: true,
          retryText: trimmed,
        });
        setGuestError("Failed to send guest message.");
        return { ok: false, reason: "network" };
      } finally {
        setGuestLoading(false);
      }
    },
    [appendGuestMessage, canSendGuestMessage, guestKey],
  );

  const resetGuestSession = useCallback(() => {
    setGuestMessages([]);
    setGuestMessageCount(0);
    setGuestKey("");
    setGuestError("");
  }, []);

  const value = useMemo(
    () => ({
      guestLimit: GUEST_LIMIT,
      pendingHeroMessage,
      setPendingHeroMessage,
      consumePendingHeroMessage,
      guestMessages,
      guestMessageCount,
      guestKey,
      guestLoading,
      guestError,
      canSendGuestMessage,
      sendGuestMessage,
      resetGuestSession,
    }),
    [
      pendingHeroMessage,
      setPendingHeroMessage,
      consumePendingHeroMessage,
      guestMessages,
      guestMessageCount,
      guestKey,
      guestLoading,
      guestError,
      canSendGuestMessage,
      sendGuestMessage,
      resetGuestSession,
    ],
  );

  return <ChatSessionContext.Provider value={value}>{children}</ChatSessionContext.Provider>;
};

export const useChatSession = () => {
  const context = useContext(ChatSessionContext);
  if (!context) throw new Error("useChatSession must be used inside ChatSessionProvider");
  return context;
};
