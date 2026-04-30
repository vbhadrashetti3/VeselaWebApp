import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/chat/Header";
import { Box, Container } from "@mui/material";

export default function ChatPage() {
  return (
    // minHeight ensures the background covers the screen, but allows growth
    <Box sx={{ minHeight: "100vh", bgcolor: "#0d0d12" }}>
      {/* Header is position="fixed" inside its own component */}
      <Header />

      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // Padding top to clear fixed Header, Padding bottom to clear fixed Input
            pt: "100px",
            pb: "140px",
          }}
        >
          <ChatBubble role="assistant" message="Hello. I am initialized..." />
          <ChatBubble
            role="user"
            message="I need to optimize a React component..."
          />
          {/* Add more bubbles to test the page scroll */}
          {[...Array(10)].map((_, i) => (
            <ChatBubble
              key={i}
              role="assistant"
              message="Scrolling the whole page now..."
            />
          ))}
        </Box>
      </Container>

      {/* ChatInput is position="fixed" so it stays visible while page scrolls */}
      <ChatInput />
    </Box>
  );
}
