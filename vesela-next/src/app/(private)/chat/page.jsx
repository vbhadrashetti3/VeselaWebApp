import ChatPage from "@/components/chat/ChatPage";
import Header from "@/components/chat/Header";
import { Box } from "@mui/material";

export default function Page() {
  return (
    // minHeight ensures the background covers the screen, but allows growth
    <Box sx={{ minHeight: "100vh", bgcolor: "#000" }}>
      {/* Header is position="fixed" inside its own component */}
      <Header />
      <ChatPage />
    </Box>
  );
}
