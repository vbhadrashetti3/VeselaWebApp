import ChatPage from "@/components/chat/ChatPage";
import Header from "@/components/chat/Header";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <Box>
      {/* Header is position="fixed" inside its own component */}
      <Header />
      <ChatPage />
    </Box>
  );
}
