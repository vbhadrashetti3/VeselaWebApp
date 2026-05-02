"use client";

import { Box, Container } from "@mui/material";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function ChatPage() {
  const { messages, sendMessage, isConnected, isTyping, isThinking } =
    useChatSocket();

  const bottomRef = useRef(null);

  // ✅ Smooth but stable scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
    console.log("Scrolled to bottom", Date.now());
  }, [messages.length]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Chat Area */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Container maxWidth="md">
          <Box
            sx={{
              pt: 10,
              pb: 12,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} message={msg.message} />
            ))}

            {/* Thinking */}
            {isThinking && (
              <ChatBubble role="assistant" message="🤔 Thinking..." />
            )}

            <div ref={bottomRef} />
          </Box>
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
