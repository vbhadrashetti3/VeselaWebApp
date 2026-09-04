"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getAccessToken } from "@/lib/tokenManager";
import {
  endVoiceSession,
  saveVoiceTurn,
  startVoiceSession,
} from "@/services/voice.service";

const UPGRADE_COPY = "This feature requires a paid subscription";

function readActiveConversationId() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("vesela_active_conversation_id");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function persistConversationId(id) {
  if (typeof window === "undefined" || id == null) return;
  localStorage.setItem("vesela_active_conversation_id", String(id));
}

function clientTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
  } catch {
    return "America/Chicago";
  }
}

function describeStartError(err) {
  const code = err?.code;
  if (code === "mic_permission_denied") {
    return "Microphone access is required for an audio conversation.";
  }
  if (code === "session_expired") {
    return "The voice session expired before it could connect. Please try again.";
  }
  if (code === "connection_failed") {
    return "Unable to connect the voice session. Please try again.";
  }
  return err?.message || "Unable to start the voice session. Please try again.";
}

function endVoiceKeepalive(fishSessionId, conversationId) {
  if (typeof window === "undefined") return;
  const token = getAccessToken();
  fetch("/api/proxy/api/voice/end/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      fish_session_id: fishSessionId,
      conversation_id: conversationId,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export function useVoiceSession({
  onConversationId,
  onTranscriptTurn,
  onExpired,
} = {}) {
  const [status, setStatus] = useState("idle");
  const [mode, setMode] = useState("listening");
  const [error, setError] = useState(null);
  const [activityLevel, setActivityLevel] = useState(0);

  const sessionRef = useRef(null);
  const generationRef = useRef(0);
  const conversationIdRef = useRef(null);
  const fishSessionIdRef = useRef(null);
  const pendingUserTextRef = useRef(null);
  const pendingRotateRef = useRef(null);
  const rotatingRef = useRef(false);
  const endingRef = useRef(false);
  const modeRef = useRef("listening");
  const rafRef = useRef(null);
  const unsubscribersRef = useRef([]);

  const callbacksRef = useRef({ onConversationId, onTranscriptTurn, onExpired });
  useEffect(() => {
    callbacksRef.current = { onConversationId, onTranscriptTurn, onExpired };
  }, [onConversationId, onTranscriptTurn, onExpired]);

  const stopLevelLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startLevelLoop = useCallback(() => {
    stopLevelLoop();
    const startedAt = performance.now();

    const tick = (now) => {
      const session = sessionRef.current;
      if (!session) {
        const pulse = 0.28 + 0.22 * Math.sin((now - startedAt) / 280);
        setActivityLevel(pulse);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const output = Number(session.getOutputVolume?.() ?? 0) || 0;
      const input = Number(session.getInputVolume?.() ?? 0) || 0;
      if (modeRef.current === "speaking") {
        setActivityLevel(Math.min(1, output));
      } else {
        setActivityLevel(Math.min(1, Math.max(output, input * 0.4)));
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [stopLevelLoop]);

  const detachSession = useCallback(() => {
    unsubscribersRef.current.forEach((off) => {
      try {
        off();
      } catch {
        // ignore
      }
    });
    unsubscribersRef.current = [];
  }, []);

  const persistTurn = useCallback(async (userText, assistantText) => {
    const conversationId = conversationIdRef.current;
    const trimmedUser = (userText || "").trim();
    if (!conversationId || !trimmedUser) return;

    const result = await saveVoiceTurn({
      conversationId,
      userText: trimmedUser,
      assistantText: (assistantText || "").trim(),
      fishSessionId: fishSessionIdRef.current,
    });

    if (!result.ok) {
      console.warn("[voice] Failed to save turn:", result.message);
      if (result.expired) {
        endingRef.current = true;
        generationRef.current += 1;
        const session = sessionRef.current;
        sessionRef.current = null;
        detachSession();
        session?.end?.().catch(() => undefined);
        stopLevelLoop();
        setStatus("idle");
        callbacksRef.current.onExpired?.();
      }
      return;
    }

    callbacksRef.current.onTranscriptTurn?.(
      trimmedUser,
      (assistantText || "").trim(),
    );

    if (result.data?.rotate && result.data?.session_token) {
      pendingRotateRef.current = result.data;
      console.info("[voice] Rotate requested at chat_count", result.data.chat_count);
    }
  }, [detachSession, stopLevelLoop]);

  const attachSession = useCallback(
    (session) => {
      detachSession();
      sessionRef.current = session;
      modeRef.current = session.mode || "listening";
      setMode(modeRef.current);

      const on = (event, handler) => {
        session.on(event, handler);
        unsubscribersRef.current.push(() => session.off?.(event, handler));
      };

      on("modeChange", (nextMode) => {
        modeRef.current = nextMode;
        setMode(nextMode);
      });

      on("message", ({ role, text }) => {
        const content = (text || "").trim();
        if (!content) return;
        if (role === "user") {
          pendingUserTextRef.current = content;
          return;
        }
        if (role === "agent" && pendingUserTextRef.current) {
          const userText = pendingUserTextRef.current;
          pendingUserTextRef.current = null;
          void persistTurn(userText, content);
        }
      });

      on("error", (err) => {
        console.warn("[voice] Session error:", err?.code || err);
      });

      on("disconnect", ({ reason } = {}) => {
        if (rotatingRef.current || endingRef.current) return;
        console.info("[voice] Disconnected:", reason);
        if (reason && reason !== "user_hangup") {
          setError("The voice session ended. You can close this and try again.");
          setStatus("error");
          stopLevelLoop();
          setActivityLevel(0);
        }
      });
    },
    [detachSession, persistTurn, stopLevelLoop],
  );

  const connectFish = useCallback(
    async (sessionToken, generation) => {
      const { AgentSession } = await import("@fishaudio/agent-client");
      const session = await AgentSession.start({
        sessionToken,
        timezone: clientTimeZone(),
      });
      if (generation !== generationRef.current) {
        await session.end().catch(() => undefined);
        return null;
      }
      if (typeof session.startAudio === "function") {
        await session.startAudio().catch(() => undefined);
      }
      attachSession(session);
      setStatus("connected");
      return session;
    },
    [attachSession],
  );

  const rotateIfNeeded = useCallback(async () => {
    const pending = pendingRotateRef.current;
    if (!pending || rotatingRef.current || endingRef.current) return;
    if (modeRef.current === "speaking") return;

    pendingRotateRef.current = null;
    rotatingRef.current = true;
    const generation = generationRef.current;
    const previous = sessionRef.current;
    sessionRef.current = null;
    detachSession();

    try {
      console.info("[voice] Rotating Fish session");
      if (previous) {
        await previous.end();
      }
      if (generation !== generationRef.current) return;

      fishSessionIdRef.current =
        pending.fish_session_id || pending.session_token?.session_id || null;
      await connectFish(pending.session_token, generation);
    } catch (err) {
      console.error("[voice] Rotate failed:", err);
      setError("Unable to continue the voice session. Please try again.");
      setStatus("error");
      stopLevelLoop();
    } finally {
      rotatingRef.current = false;
    }
  }, [connectFish, detachSession, stopLevelLoop]);

  useEffect(() => {
    if (status !== "connected") return undefined;
    const timer = setInterval(() => {
      void rotateIfNeeded();
    }, 400);
    return () => clearInterval(timer);
  }, [rotateIfNeeded, status]);

  const hangup = useCallback(async () => {
    if (endingRef.current && !sessionRef.current) {
      setStatus("idle");
      setError(null);
      setActivityLevel(0);
      stopLevelLoop();
      return;
    }

    endingRef.current = true;
    generationRef.current += 1;
    pendingRotateRef.current = null;
    pendingUserTextRef.current = null;
    stopLevelLoop();
    setActivityLevel(0);

    const session = sessionRef.current;
    sessionRef.current = null;
    detachSession();

    if (session) {
      try {
        await session.end();
      } catch (err) {
        console.warn("[voice] Fish hangup failed:", err);
      }
    }

    const fishSessionId = fishSessionIdRef.current;
    const conversationId = conversationIdRef.current;
    fishSessionIdRef.current = null;

    if (fishSessionId || conversationId) {
      const result = await endVoiceSession({ fishSessionId, conversationId });
      if (!result.ok) {
        console.warn("[voice] End session failed:", result.message);
      }
    }

    setStatus("idle");
    setMode("listening");
    setError(null);
    endingRef.current = false;
  }, [detachSession, stopLevelLoop]);

  const start = useCallback(async () => {
    if (sessionRef.current || fishSessionIdRef.current) {
      await hangup();
    }
    endingRef.current = false;
    const generation = generationRef.current + 1;
    generationRef.current = generation;

    setStatus("connecting");
    setError(null);
    setMode("listening");
    startLevelLoop();

    const conversationId = readActiveConversationId();
    console.info("[voice] Starting session", { conversationId });

    const result = await startVoiceSession({
      timeZone: clientTimeZone(),
      conversationId,
    });

    if (generation !== generationRef.current) return { ok: false, cancelled: true };

    if (!result.ok) {
      stopLevelLoop();
      setActivityLevel(0);
      if (result.expired) {
        setStatus("idle");
        callbacksRef.current.onExpired?.();
        return { ok: false, expired: true, message: result.message };
      }
      setError(result.message);
      setStatus("error");
      return { ok: false, message: result.message, upgrade: result.message?.includes(UPGRADE_COPY) };
    }

    const data = result.data || {};
    conversationIdRef.current = data.conversation_id ?? conversationId;
    fishSessionIdRef.current =
      data.fish_session_id || data.session_token?.session_id || null;
    persistConversationId(conversationIdRef.current);
    callbacksRef.current.onConversationId?.(conversationIdRef.current);

    if (!data.session_token) {
      stopLevelLoop();
      setError("Unable to start the voice session. Please try again.");
      setStatus("error");
      return { ok: false };
    }

    try {
      await connectFish(data.session_token, generation);
      console.info("[voice] Connected", {
        conversationId: conversationIdRef.current,
        fishSessionId: fishSessionIdRef.current,
      });
      return { ok: true };
    } catch (err) {
      if (generation !== generationRef.current) return { ok: false, cancelled: true };
      console.error("[voice] Fish connect failed:", err);
      stopLevelLoop();
      setActivityLevel(0);
      setError(describeStartError(err));
      setStatus("error");
      return { ok: false, message: describeStartError(err) };
    }
  }, [connectFish, hangup, startLevelLoop, stopLevelLoop]);

  // Teardown for the paths that cannot await hangup(): tab close, and client-side
  // navigation away from the page that owns the session (browser back, logout from
  // the settings modal). Without this the Fish session keeps the mic and keeps
  // talking, and the backend never sees the end call.
  useEffect(() => {
    const teardown = () => {
      const session = sessionRef.current;
      const fishSessionId = fishSessionIdRef.current;
      const conversationId = conversationIdRef.current;
      if (!session && !fishSessionId) return;

      endingRef.current = true;
      generationRef.current += 1;
      sessionRef.current = null;
      fishSessionIdRef.current = null;
      unsubscribersRef.current = [];

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      try {
        session?.end?.();
      } catch {
        // ignore
      }
      endVoiceKeepalive(fishSessionId, conversationId);
    };

    window.addEventListener("pagehide", teardown);
    return () => {
      window.removeEventListener("pagehide", teardown);
      teardown();
    };
  }, []);

  return {
    status,
    mode,
    error,
    activityLevel,
    isOpen: status === "connecting" || status === "connected" || status === "error",
    start,
    hangup,
  };
}
