"use client";

import { useState, useRef } from "react";

/**
 * Glassmorphic pill-shaped search input that matches the design system.
 *
 * Props:
 *   placeholder   – input placeholder text
 *   onSearch(str) – callback invoked when the user submits a query
 */
export default function AISearchInput({
  placeholder = "Start a conversation with Vesela",
  onSearch,
}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = value.trim();
    onSearch?.(trimmed);
    setValue("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="prompt-cta"
      style={{
        width: "min(610px, 100%)",
        margin: "0 auto",
        cursor: "text",
        boxSizing: "border-box",
      }}
      onClick={(e) => {
        if (e.target.closest("button")) return;
        inputRef.current?.focus();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#ffffff",
          fontSize: "16px",
          fontFamily: "inherit",
          width: "100%",
          paddingRight: "12px",
        }}
      />

      <button
        type="submit"
        aria-label="Send message"
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
        }}
      >
        <b aria-hidden="true">→</b>
      </button>
    </form>
  );
}

