"use client";

import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState } from "react";

export default function AISearchInput({
  placeholder = "Ask Vesela AI anything...",
  onSearch,
  width = { xs: "100%", sm: "520px" },
}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSearch?.(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Box textAlign="center">
      <OutlinedInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        fullWidth
        sx={{
          mt: 3,
          height: 64,
          borderRadius: "50px",
          px: 1.5,
          width,

          // 🔥 Glass background
          bgcolor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.15)",
          backgroundImage: "none",

          transition: "all 0.25s ease",

          "& fieldset": {
            border: "none",
          },

          // ✅ FIX: input text + placeholder
          "& .MuiOutlinedInput-input": {
            color: "white",
            backgroundColor: "transparent",
          },

          "& .MuiOutlinedInput-input::placeholder": {
            color: "rgba(255,255,255,0.6)",
            opacity: 1,
          },

          // ✅ Shadow states
          boxShadow: focused
            ? "0 0 0 1px rgba(255,255,255,0.4), 0 10px 40px rgba(0,0,0,0.5)"
            : "0 8px 30px rgba(0,0,0,0.4)",

          "&:hover": {
            border: "1px solid rgba(255,255,255,0.3)",
          },
        }}
        startAdornment={
          <InputAdornment position="start">
            <AutoAwesomeIcon
              sx={{
                color: focused ? "white" : "rgba(255,255,255,0.6)",
                transition: "0.2s",
              }}
            />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleSubmit}
              disabled={!value.trim()}
              sx={{
                bgcolor: "white",
                color: "black",
                transition: "0.2s",

                "&:hover": {
                  bgcolor: "#ddd",
                  transform: "scale(1.05)",
                },

                "&.Mui-disabled": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />

      {/* 🔹 Hint text */}
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255,255,255,0.7)",
          mt: 1,
          display: "block",
        }}
      >
        Press Enter to start chatting
      </Typography>
    </Box>
  );
}
