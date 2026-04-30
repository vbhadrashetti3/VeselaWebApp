"use client";

import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material";
import { AttachFile, Send } from "@mui/icons-material";

export default function ChatInput() {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pb: 4, // Padding from the very bottom of the screen
        pt: 2,
        backgroundColor: "#000",
      }}
    >
      <Container maxWidth="md">
        <OutlinedInput
          fullWidth
          placeholder="Message DevAssistant..."
          startAdornment={
            <InputAdornment position="start">
              <AttachFile sx={{ color: "gray" }} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                sx={{ bgcolor: "#333", "&:hover": { bgcolor: "#444" }, ml: 1 }}
              >
                <Send sx={{ color: "white", fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          }
          sx={{
            bgcolor: "#1e1e26",
            borderRadius: 3,
            color: "white",
            "& fieldset": { borderColor: "#333" },
            "& .MuiOutlinedInput-input": { py: 1.5 },
            "&:hover fieldset": { borderColor: "#444" },
            "&.Mui-focused fieldset": { borderColor: "primary.main" },
          }}
        />
      </Container>
    </Box>
  );
}
