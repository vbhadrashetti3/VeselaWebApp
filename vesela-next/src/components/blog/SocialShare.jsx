"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Link2, Check, Share2 } from "lucide-react";

export default function SocialShare({ title = "", url = "" }) {
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const input = document.createElement("input");
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Box
      className="social-share-container"
      sx={{
        py: 3,
        my: 4,
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: "var(--ink)",
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: "0.9rem",
        }}
      >
        <Share2 size={18} /> Share this article
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Share on LinkedIn">
          <IconButton
            component="a"
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--surface)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              "&:hover": {
                background: "#0077b5",
                color: "#ffffff",
                borderColor: "#0077b5",
              },
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>in</span>
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on X / Twitter">
          <IconButton
            component="a"
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--surface)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              "&:hover": {
                background: "#000000",
                color: "#ffffff",
                borderColor: "#000000",
              },
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>𝕏</span>
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on Facebook">
          <IconButton
            component="a"
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--surface)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              "&:hover": {
                background: "#1877f2",
                color: "#ffffff",
                borderColor: "#1877f2",
              },
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>f</span>
          </IconButton>
        </Tooltip>

        <Tooltip title={copied ? "Link Copied!" : "Copy Link"}>
          <IconButton
            onClick={handleCopyLink}
            aria-label="Copy article link to clipboard"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: copied ? "var(--accent)" : "var(--surface)",
              color: copied ? "#ffffff" : "var(--ink)",
              border: "1px solid",
              borderColor: copied ? "var(--accent)" : "var(--line)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "var(--accent)",
                color: "#ffffff",
                borderColor: "var(--accent)",
              },
            }}
          >
            {copied ? <Check size={18} /> : <Link2 size={18} />}
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Article link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}
