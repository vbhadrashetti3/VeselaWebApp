"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  IconButton,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { Copy, Check } from "lucide-react";
import GenericModalWrapper from "@/components/modals/GenericModalWrapper";
import { post } from "@/lib/apiService";

// ─── ShareModal ────────────────────────────────────────────────────────────────
// Migrated from VeselaAIWebApp, adapted for Vesela:
//   • VeselaAI `postData`      → Vesela `post` from @/lib/apiService
//   • VeselaAI `useToast`      → self-contained MUI Snackbar (no context required)
//   • VeselaAI `CustomButton`  → MUI Button (via Vesela theme overrides)
//   • VeselaAI `GenericModalWrapper` → Vesela's GenericModalWrapper
//   • Same API endpoint: POST /api/share/ { conversation_id }

const ShareModal = ({ open, onClose, conversationId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [apiError, setApiError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const generateLink = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setApiError("");
    setShareUrl("");
    setCopied(false);

    try {
      const response = await post("/api/share/", {
        conversation_id: conversationId,
      });

      if (response && !response.error) {
        const rawUrl = response.data?.share_url || "";
        // Extract the uuid from the returned share_url
        // e.g. "https://example.com/share/uuid-here" → "uuid-here"
        const uuid = rawUrl.split("/share/").pop();
        if (uuid) {
          const localUrl = `${window.location.origin}/share/${uuid}`;
          setShareUrl(localUrl);
        } else {
          setApiError("Failed to parse the share URL from the server.");
        }
      } else {
        setApiError(response?.message || "Failed to create share link.");
      }
    } catch (err) {
      console.error("❌ Failed to generate share link:", err);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Generate link whenever the modal opens with a valid conversationId
  useEffect(() => {
    if (open && conversationId) {
      generateLink();
    }
  }, [open, conversationId, generateLink]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Failed to copy to clipboard:", err);
      showToast("Failed to copy link. Please select and copy manually.", "error");
    }
  };

  return (
    <>
      <GenericModalWrapper open={open} onClose={onClose} width="460px">
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, pr: 4 }}>
            Share Conversation
          </Typography>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                gap: 2,
              }}
            >
              <CircularProgress size={36} thickness={4} />
              <Typography variant="body2" color="text.secondary">
                Generating your shared link...
              </Typography>
            </Box>
          ) : apiError ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
                gap: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                {apiError}
              </Typography>
              <Box
                component="button"
                onClick={generateLink}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.custom.border.strong}`,
                  bgcolor: "transparent",
                  color: "text.primary",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                Retry
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Anyone with this public link will be able to view this conversation,
                including all its messages.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Share Link
                </Typography>
                <OutlinedInput
                  value={shareUrl}
                  readOnly
                  fullWidth
                  sx={{
                    borderRadius: 2.5,
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.03)"
                        : "rgba(255,255,255,0.03)",
                    color: theme.palette.text.primary,
                    height: 48,
                    fontSize: "14px",
                    "& .MuiOutlinedInput-input": {
                      paddingRight: "40px",
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleCopy}
                        edge="end"
                        title="Copy to clipboard"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Box
                  component="button"
                  onClick={onClose}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.custom.border.strong}`,
                    bgcolor: "transparent",
                    color: "text.primary",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  Close
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </GenericModalWrapper>

      {/* Self-contained toast feedback — no ToastContext dependency */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareModal;
