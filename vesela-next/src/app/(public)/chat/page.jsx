"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicChat() {
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  const sendMessage = () => {
    // 1. Check message count in localStorage
    const count = parseInt(localStorage.getItem("chat_count") || "0");

    if (count >= 6) {
      // 2. Redirect to login if limit reached
      router.push("/login");
      return;
    }

    // 3. Logic to send message and increment count
    localStorage.setItem("chat_count", (count + 1).toString());
    // ... add message to state
  };

  return (
    <Box>
      {/* Your Chat UI */}
      <Button onClick={sendMessage}>Send Message</Button>
    </Box>
  );
}
