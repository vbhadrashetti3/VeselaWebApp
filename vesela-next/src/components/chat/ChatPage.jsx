import { Box, Container } from "@mui/material";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
export default function ChatPage() {
  return (
    <>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
      <ChatInput />
    </>
  );
}
