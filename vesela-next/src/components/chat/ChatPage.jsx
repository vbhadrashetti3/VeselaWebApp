"use client";

import { Box, Container, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function ChatPage() {
  const { messages, sendMessage, isConnected, isTyping, isThinking } =
    useChatSocket();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Status */}
      <Typography sx={{ p: 1, fontSize: 12 }}>
        {isConnected ? "🟢 Connected" : "🔴 Connecting..."}
      </Typography>

      {/* Chat */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Container maxWidth="md">
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              message={msg.message}
              isTyping={isTyping && i === messages.length - 1}
            />
          ))}

          {isThinking && <ChatBubble role="assistant" message="🤔 Thinking..." />}

          <div ref={bottomRef} />
        </Container>
      </Box>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isConnected={isConnected}
        isTyping={isTyping}
      />
    </Box>
  );
}