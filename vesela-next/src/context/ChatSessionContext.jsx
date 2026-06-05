"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { post } from "@/lib/apiService";

// ---------------------------------------------------
// STORAGE KEYS
// ---------------------------------------------------

const STORAGE_KEYS = {
  pendingHeroMessage: "vesela_pending_hero_message",
  guestMessages: "vesela_guest_messages",
  guestKey: "vesela_guest_key",
  guestLastActive: "vesela_guest_last_active",

  // backend signup lock
  guestSignupRequired: "vesela_guest_signup_required",
};

// ---------------------------------------------------
// CONTEXT
// ---------------------------------------------------

const ChatSessionContext = createContext(null);

// ---------------------------------------------------
// STORAGE HELPERS
// ---------------------------------------------------

const parseStored = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

// ---------------------------------------------------
// PROVIDER
// ---------------------------------------------------

export const ChatSessionProvider = ({ children }) => {
  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------

  const [pendingHeroMessage, setPendingHeroMessageState] = useState("");

  const [guestMessages, setGuestMessages] = useState([]);

  const [guestKey, setGuestKey] = useState("");

  const [guestLoading, setGuestLoading] = useState(false);

  const [guestError, setGuestError] = useState("");

  const [hasInitializedSession, setHasInitializedSession] = useState(false);

  const [guestSignupRequired, setGuestSignupRequired] = useState(false);

  // ---------------------------------------------------
  // INIT LOAD
  // ---------------------------------------------------

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingHeroMessageState(
      parseStored(STORAGE_KEYS.pendingHeroMessage, ""),
    );

    setGuestMessages(parseStored(STORAGE_KEYS.guestMessages, []));

    setGuestKey(parseStored(STORAGE_KEYS.guestKey, ""));

    setGuestSignupRequired(
      parseStored(STORAGE_KEYS.guestSignupRequired, false),
    );
  }, []);

  // ---------------------------------------------------
  // PERSISTENCE
  // ---------------------------------------------------

  useEffect(() => {
    setStored(STORAGE_KEYS.pendingHeroMessage, pendingHeroMessage);
  }, [pendingHeroMessage]);

  useEffect(() => {
    setStored(STORAGE_KEYS.guestMessages, guestMessages);
  }, [guestMessages]);

  useEffect(() => {
    setStored(STORAGE_KEYS.guestKey, guestKey);
  }, [guestKey]);

  useEffect(() => {
    setStored(STORAGE_KEYS.guestSignupRequired, guestSignupRequired);
  }, [guestSignupRequired]);

  // ---------------------------------------------------
  // LOCK CHECK
  // ---------------------------------------------------

  const canSendGuestMessage = !guestSignupRequired;

  // ---------------------------------------------------
  // HERO MESSAGE
  // ---------------------------------------------------

  const setPendingHeroMessage = useCallback((message) => {
    setPendingHeroMessageState(message?.trim() || "");
  }, []);

  const consumePendingHeroMessage = useCallback(() => {
    const message = pendingHeroMessage?.trim();

    setPendingHeroMessageState("");

    return message;
  }, [pendingHeroMessage]);

  // ---------------------------------------------------
  // APPEND MESSAGE
  // ---------------------------------------------------

  const appendGuestMessage = useCallback((message) => {
    setGuestMessages((prev) => [...prev, message]);
  }, []);

  // ---------------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------------

  const sendGuestMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();

      if (!trimmed) {
        return {
          ok: false,
          reason: "empty",
        };
      }

      if (!canSendGuestMessage) {
        return {
          ok: false,
          reason: "locked",
        };
      }

      // ---------------------------------------------------
      // USER MESSAGE
      // ---------------------------------------------------

      appendGuestMessage({
        id: crypto.randomUUID(),
        role: "user",
        message: trimmed,
      });

      setGuestLoading(true);

      setGuestError("");

      try {
        // ---------------------------------------------------
        // API BODY
        // ---------------------------------------------------

        const body = hasInitializedSession
          ? {
              text: trimmed,
              key: guestKey || "",
            }
          : {
              text: "initial_message",
              key: "",
            };

        const { status, data, error } = await post(
          "/api/sales_incoming/",
          body,
        );

        // ---------------------------------------------------
        // API ERROR
        // ---------------------------------------------------

        if (error || status !== 201) {
          appendGuestMessage({
            id: crypto.randomUUID(),
            role: "assistant",
            message: "I could not answer right now. Please retry.",
            isError: true,
            retryText: trimmed,
          });

          return {
            ok: false,
            reason: "api",
          };
        }

        // ---------------------------------------------------
        // RESPONSE
        // ---------------------------------------------------

        const response = data?.response;

        if (!response) {
          return {
            ok: false,
            reason: "invalid_response",
          };
        }

        // ---------------------------------------------------
        // SAVE KEY
        // ---------------------------------------------------

        if (response?.key) {
          setGuestKey(response.key);
        }

        // ---------------------------------------------------
        // SESSION INITIALIZED
        // ---------------------------------------------------

        if (!hasInitializedSession) {
          setHasInitializedSession(true);
        }

        // ---------------------------------------------------
        // LAST ACTIVE
        // ---------------------------------------------------

        setStored(STORAGE_KEYS.guestLastActive, Date.now());

        // ---------------------------------------------------
        // ASSISTANT MESSAGE
        // ---------------------------------------------------

        appendGuestMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          message:
            response?.text || "Thanks. I am ready for your next question.",
        });

        // ---------------------------------------------------
        // BACKEND LOCK
        // ---------------------------------------------------

        if (response?.showSignup === true) {
          setGuestSignupRequired(true);
        }

        return { ok: true };
      } catch (err) {
        console.error(err);

        appendGuestMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          message: "Network error. Please retry.",
          isError: true,
          retryText: trimmed,
        });

        setGuestError("Failed to send guest message.");

        return {
          ok: false,
          reason: "network",
        };
      } finally {
        setGuestLoading(false);
      }
    },
    [appendGuestMessage, canSendGuestMessage, guestKey, hasInitializedSession],
  );

  // ---------------------------------------------------
  // RESET
  // ---------------------------------------------------

  const resetGuestSession = useCallback(() => {
    setGuestMessages([]);

    setGuestKey("");

    setGuestError("");

    setHasInitializedSession(false);

    setGuestSignupRequired(false);

    localStorage.removeItem(STORAGE_KEYS.guestMessages);

    localStorage.removeItem(STORAGE_KEYS.guestKey);

    localStorage.removeItem(STORAGE_KEYS.guestLastActive);

    localStorage.removeItem(STORAGE_KEYS.guestSignupRequired);
  }, []);

  // ---------------------------------------------------
  // VALUE
  // ---------------------------------------------------

  const value = useMemo(
    () => ({
      pendingHeroMessage,
      setPendingHeroMessage,
      consumePendingHeroMessage,

      guestMessages,
      guestKey,

      guestLoading,
      guestError,

      guestSignupRequired,

      canSendGuestMessage,

      sendGuestMessage,

      resetGuestSession,
    }),
    [
      pendingHeroMessage,
      setPendingHeroMessage,
      consumePendingHeroMessage,

      guestMessages,
      guestKey,

      guestLoading,
      guestError,

      guestSignupRequired,

      canSendGuestMessage,

      sendGuestMessage,

      resetGuestSession,
    ],
  );

  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
};

// ---------------------------------------------------
// HOOK
// ---------------------------------------------------

export const useChatSession = () => {
  const context = useContext(ChatSessionContext);

  if (!context) {
    throw new Error("useChatSession must be used inside ChatSessionProvider");
  }

  return context;
};
