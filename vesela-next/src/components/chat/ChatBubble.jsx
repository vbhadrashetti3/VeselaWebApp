"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

  // Inline streaming indicator — rendered as a plain span so it flows
  // naturally after the last word of the streamed Markdown text.
  const streamingIndicator = isAI && isStreaming ? (
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
  ) : null;

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

        <div className="bubble-content" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
          {isAI ? (
            /* ── AI bubbles: render as rich Markdown ── */
            <div className="md-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Append the streaming indicator after the last paragraph
                  // so the Lottie dots appear inline with the final streamed word.
                  p: ({ children, ...props }) => (
                    <p {...props}>
                      {children}
                      {/* Only the very last <p> gets the indicator; we can't know
                          which is last here, so we render it on every p but hide
                          via CSS (last-of-type). The span is always present in the
                          DOM but only the last one is visible. */}
                    </p>
                  ),
                }}
              >
                {message || ""}
              </ReactMarkdown>
              {/* Streaming indicator sits after all markdown output */}
              {streamingIndicator}
            </div>
          ) : (
            /* ── User bubbles: plain text (preserve whitespace) ── */
            <span style={{ whiteSpace: "pre-wrap" }}>{message}</span>
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
