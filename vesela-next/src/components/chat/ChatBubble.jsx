"use client";

import React from "react";
import GenericLottie from "@/components/ui/GenericLottie";
import barsTyping from "@/../public/bars-typing.json";
import { useTheme } from "@mui/material/styles";

export default function ChatBubble({
  role,
  message,
  isStreaming,
  isError,
  onRetry,
}) {
  const theme = useTheme();
  const isAI = role === "assistant";

  const lottieFilter =
    theme.palette.mode === "dark" ? "invert(1) brightness(2)" : "none";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAI ? "flex-start" : "flex-end",
        width: "100%",
        marginBottom: "24px",
      }}
    >
      <div className={`bubble ${isAI ? "ai" : "user"}`}>

        <div style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
          {message}

          {/* Inline loader — visible the entire time isStreaming is true */}
          {isAI && isStreaming && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                verticalAlign: "middle",
                marginLeft: "8px",
                filter: lottieFilter,
              }}
            >
              <GenericLottie
                animationData={barsTyping}
                width={message ? 40 : 80}
                height={message ? 14 : 22}
                loop={true}
              />
            </span>
          )}
        </div>

        {/* Error UI */}
        {isError && (
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--accent)" }}>
              Something failed.
            </span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "12px",
                  color: "var(--accent)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
