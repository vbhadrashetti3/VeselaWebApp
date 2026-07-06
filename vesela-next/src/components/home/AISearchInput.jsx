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
        // Glass pill — matches reference .glass + rounded-full + border border-white/10
        background: focused
          ? "rgba(242, 251, 255, 0.30)"
          : "rgba(242, 251, 255, 0.20)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${focused ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)"}`,
        borderRadius: "9999px",
        padding: "8px 8px 8px 24px",
        boxShadow: focused
          ? "0 0 0 1px rgba(255,255,255,0.15), 0 16px 48px rgba(0,0,0,0.35)"
          : "0 8px 32px rgba(0,0,0,0.20)",
        transition: "all 0.5s ease",
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
          fontSize: "18px",
          lineHeight: 1.5,
          padding: "16px 0",
          textAlign: "center",
          fontFamily: "var(--font-inter), Inter, sans-serif",
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
          background: "white",
          color: "#250514",
          transition: "transform 0.2s ease",
          transform: "none",
          outline: "none",
          marginRight: "4px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.90)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1.07)";
        }}
      >
        {/* arrow_forward icon as inline SVG */}
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
