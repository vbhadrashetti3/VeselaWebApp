"use client";

import React, { useState } from "react";
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Container,
  Tooltip,
} from "@mui/material";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export default function ChatInput() {
  const [inputValue, setInputValue] = useState("");

  // Determine if the send button should be enabled
  const isSendEnabled = inputValue.trim().length > 0;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pb: 4,
        pt: 2,
        backgroundColor: "#000",
      }}
    >
      <Container maxWidth="md">
        <OutlinedInput
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Send Message ..."
          endAdornment={
            <InputAdornment position="end">
              <Tooltip
                title="Voice input coming in the next release"
                arrow
                placement="top"
              >
                <Box component="span">
                  <IconButton
                    disabled
                    sx={{
                      bgcolor: "#333",
                      width: 40,
                      height: 40,
                      ml: 1,
                      "&.Mui-disabled": {
                        bgcolor: "#333",
                        opacity: 0.5,
                        color: "rgba(255, 255, 255, 0.3)",
                      },
                    }}
                  >
                    <MicNoneOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Tooltip>

              <IconButton
                disabled={!isSendEnabled}
                sx={{
                  // Dynamic background: White when enabled, dark grey when disabled
                  bgcolor: isSendEnabled ? "#fff !important" : "#333",
                  width: 40,
                  height: 40,
                  ml: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: isSendEnabled ? "#f0f0f0 !important" : "#444",
                  },
                  // Fix for Material UI disabled state styles
                  "&.Mui-disabled": {
                    bgcolor: "#333",
                    opacity: 0.6,
                  },
                }}
              >
                <SendOutlinedIcon
                  sx={{
                    // Dynamic icon color: Black when enabled, White when disabled
                    color: isSendEnabled ? "#000" : "white",
                    fontSize: 18,
                  }}
                />
              </IconButton>
            </InputAdornment>
          }
          sx={{
            bgcolor: "#1e1e26",
            borderRadius: 10,
            color: "white",
            height: 60,
            "& fieldset": { borderColor: "#333" },
            "& .MuiOutlinedInput-input": { py: 1.5, px: 2 },
            "&:hover fieldset": { borderColor: "#444" },
            "&.Mui-focused fieldset": { borderColor: "primary.main" },
          }}
        />
      </Container>
    </Box>
  );
}
