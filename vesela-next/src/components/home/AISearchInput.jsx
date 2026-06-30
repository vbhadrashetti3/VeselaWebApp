"use client";

import { useState, useRef } from "react";

// ─── AISearchInput ────────────────────────────────────────────────────────────
/**
 * Glassmorphic pill-shaped search input that matches the reference design.
 *
 * Props:
 *   placeholder  – input placeholder text
 *   onSearch(str) – callback invoked when the user submits a query
 */
export default function AISearchInput({
  placeholder = "Send message",
  onSearch,
}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const canSubmit = value.trim().length > 0;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
    setValue("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        // Glass pill
        background: focused
          ? "rgba(255,255,255,0.22)"
          : "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${focused ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"}`,
        borderRadius: "9999px",
        padding: "6px 6px 6px 24px",
        boxShadow: focused
          ? "0 0 0 1px rgba(255,255,255,0.25), 0 16px 48px rgba(0,0,0,0.45)"
          : "0 8px 32px rgba(0,0,0,0.35)",
        transition: "all 0.3s ease",
        cursor: "text",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Text input ── */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        // ≥16px font-size prevents iOS Safari from zooming on focus
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "white",
          fontSize: "clamp(15px, 2vw, 18px)",
          lineHeight: 1.5,
          padding: "10px 0",
          textAlign: "center",
          fontFamily: "inherit",
        }}
      />

      {/* ── Submit button ── */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        aria-label="Send message"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          cursor: canSubmit ? "pointer" : "default",
          background: canSubmit ? "white" : "rgba(255,255,255,0.25)",
          color: canSubmit ? "#250514" : "rgba(255,255,255,0.5)",
          transition: "all 0.2s ease",
          transform: "none",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          if (canSubmit) e.currentTarget.style.transform = "scale(1.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
        }}
        onMouseDown={(e) => {
          if (canSubmit) e.currentTarget.style.transform = "scale(0.93)";
        }}
        onMouseUp={(e) => {
          if (canSubmit) e.currentTarget.style.transform = "scale(1.07)";
        }}
      >
        {/* arrow_forward (Material Symbols) rendered as inline SVG for zero extra deps */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          width="20"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
        </svg>
      </button>
    </div>
  );
}
