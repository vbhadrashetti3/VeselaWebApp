"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { Search, X } from "lucide-react";

export default function BlogSearch({ value = "", onSearch }) {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="blog-search-bar"
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "9999px",
        px: 2,
        py: 0.6,
      }}
    >
      <InputBase
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        inputProps={{ "aria-label": "Search blog articles" }}
        sx={{
          flex: 1,
          color: "var(--ink)",
          fontSize: "0.9rem",
        }}
      />

      {searchTerm ? (
        <IconButton size="small" onClick={handleClear} aria-label="Clear search" sx={{ color: "var(--muted)", p: 0.5 }}>
          <X size={16} />
        </IconButton>
      ) : (
        <IconButton type="submit" size="small" aria-label="Submit search" sx={{ color: "var(--muted)", p: 0.5 }}>
          <Search size={16} />
        </IconButton>
      )}
    </Box>
  );
}
