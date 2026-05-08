"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { TOKEN, USER_DETAILS } from "@/constant";

const STREAM_SPEED = 8; // chars per frame
const FLUSH_INTERVAL = 16; // ~60fps

export const useChatSocket = () => {
  // ---------------------------------------------
  // WEBSOCKET REFS
  // ---------------------------------------------
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);
  const messageQueueRef = useRef([]);
  const hasConnectedRef = useRef(false);

  // ---------------------------------------------
  // STREAMING REFS
  // ---------------------------------------------
  const streamBufferRef = useRef("");
  const animationFrameRef = useRef(null);
  const flushTimerRef = useRef(null);

  const currentAssistantMsgRef = useRef("");
  const conversationIdRef = useRef(null);

  const isAnimatingRef = useRef(false);

  // ---------------------------------------------
  // STATE
  // ---------------------------------------------
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // ---------------------------------------------
  // AUTH
  // ---------------------------------------------
  const token = localStorageUtil.get(TOKEN);

  let userId = null;

  try {
    const user = localStorageUtil.get(USER_DETAILS);
    userId = user?.pk;
  } catch {}

  // ---------------------------------------------
  // SMOOTH STREAM RENDERER
  // ---------------------------------------------
  const startStreamAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    const animate = () => {
      // nothing left
      if (!streamBufferRef.current.length) {
        isAnimatingRef.current = false;
        animationFrameRef.current = null;
        return;
      }

      // take small chunk
      const nextChunk = streamBufferRef.current.slice(
        0,
        STREAM_SPEED
      );

      // remove from buffer
      streamBufferRef.current =
        streamBufferRef.current.slice(STREAM_SPEED);

      // append smoothly
      currentAssistantMsgRef.current += nextChunk;

      // SINGLE STATE UPDATE
      setMessages((prev) => {
        if (!prev.length) return prev;

        const updated = [...prev];

        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          message: currentAssistantMsgRef.current,
        };

        return updated;
      });

      animationFrameRef.current =
        requestAnimationFrame(animate);
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);
  }, []);

  // ---------------------------------------------
  // CONNECT SOCKET
  // ---------------------------------------------
  const connectSocket = useCallback(() => {
    if (!token) return;

    // prevent duplicate sockets
    if (
      socketRef.current &&
      [
        WebSocket.OPEN,
        WebSocket.CONNECTING,
      ].includes(socketRef.current.readyState)
    ) {
      return;
    }

    const socket = new WebSocket(
      `wss://portal.grayskyai.com/ws/chat/?token=${token}`
    );

    socketRef.current = socket;

    // ---------------------------------------------
    // OPEN
    // ---------------------------------------------
    socket.onopen = () => {
      setIsConnected(true);

      // flush queued messages
      if (messageQueueRef.current.length) {
        messageQueueRef.current.forEach((msg) => {
          socket.send(JSON.stringify(msg));
        });

        messageQueueRef.current = [];
      }
    };

    // ---------------------------------------------
    // CLOSE
    // ---------------------------------------------
    socket.onclose = (event) => {
      setIsConnected(false);

      socketRef.current = null;

      // reconnect only on abnormal close
      if (event.code !== 1000) {
        reconnectRef.current = setTimeout(() => {
          connectSocket();
        }, 3000);
      }
    };

    // ---------------------------------------------
    // ERROR
    // ---------------------------------------------
    socket.onerror = () => {
      socket.close();
    };

    // ---------------------------------------------
    // MESSAGE
    // ---------------------------------------------
    socket.onmessage = (event) => {
      let data;

      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        // ---------------------------------------------
        // THINKING
        // ---------------------------------------------
        case "thinking":
          setIsThinking(true);
          break;

        // ---------------------------------------------
        // STREAM START
        // ---------------------------------------------
        case "stream_start":
          setIsThinking(false);
          setIsTyping(true);

          // reset buffers
          currentAssistantMsgRef.current = "";
          streamBufferRef.current = "";

          // create empty assistant message
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              message: "",
            },
          ]);

          break;

        // ---------------------------------------------
        // CHUNK
        // ---------------------------------------------
        case "chunk":
          if (isThinking) {
            setIsThinking(false);
          }

          // add incoming text to buffer
          streamBufferRef.current += data.content;

          // start smooth animation loop
          startStreamAnimation();

          break;

        // ---------------------------------------------
        // DONE
        // ---------------------------------------------
        case "done":
          setIsTyping(false);
          setIsThinking(false);

          // flush remaining text instantly
          if (streamBufferRef.current.length) {
            currentAssistantMsgRef.current +=
              streamBufferRef.current;

            streamBufferRef.current = "";

            setMessages((prev) => {
              const updated = [...prev];

              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                message: currentAssistantMsgRef.current,
              };

              return updated;
            });
          }

          if (data.conversation_id) {
            conversationIdRef.current =
              data.conversation_id;
          }

          break;

        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------
        case "error":
          setIsTyping(false);
          setIsThinking(false);

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              message:
                data.message ||
                "Something went wrong",
              isError: true,
            },
          ]);

          break;

        default:
          break;
      }
    };
  }, [token, isThinking, startStreamAnimation]);

  // ---------------------------------------------
  // INITIALIZE
  // ---------------------------------------------
  useEffect(() => {
    if (!token || hasConnectedRef.current) return;

    hasConnectedRef.current = true;

    // restore previous messages
    const saved =
      localStorage.getItem("chat_messages");

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }

    connectSocket();

    return () => {
      // close socket
      socketRef.current?.close(1000);

      // clear reconnects
      clearTimeout(reconnectRef.current);

      // cancel animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      // clear flush timer
      clearInterval(flushTimerRef.current);

      // reset refs
      streamBufferRef.current = "";
      currentAssistantMsgRef.current = "";
      isAnimatingRef.current = false;

      // OPTIONAL:
      // clear messages on unmount
      // setMessages([]);
    };
  }, [token, connectSocket]);

  // ---------------------------------------------
  // PERSIST MESSAGES
  // ---------------------------------------------
  useEffect(() => {
    localStorage.setItem(
      "chat_messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  // ---------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------
  const sendMessage = useCallback(
    (text) => {
      if (!text?.trim()) return;

      const payload = {
        user_id: userId,
        text,
        conversation_id:
          conversationIdRef.current,
        time_zone:
          Intl.DateTimeFormat().resolvedOptions()
            .timeZone,
      };

      // optimistic UI
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          message: text,
        },
      ]);

      setIsThinking(true);
      setIsTyping(false);

      const socket = socketRef.current;

      // queue if socket unavailable
      if (
        !socket ||
        socket.readyState !== WebSocket.OPEN
      ) {
        messageQueueRef.current.push(payload);

        connectSocket();

        return;
      }

      socket.send(JSON.stringify(payload));
    },
    [userId, connectSocket]
  );

  // ---------------------------------------------
  // CLEAR CHAT
  // ---------------------------------------------
  const clearChat = useCallback(() => {
    setMessages([]);

    currentAssistantMsgRef.current = "";
    streamBufferRef.current = "";

    localStorage.removeItem("chat_messages");
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,

    isConnected,
    isTyping,
    isThinking,
  };
};