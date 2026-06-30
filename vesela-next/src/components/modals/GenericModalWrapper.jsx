"use client";

import React from "react";
import { Box, Modal, useTheme, Backdrop } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { getModalContainerVariants } from "@/animations/modalMotionVariants";
import { scrollbarStyles } from "@/utils/scrollbar";

const GenericModalWrapper = ({
  open,
  onClose,
  children,
  width,
}) => {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const variants = getModalContainerVariants(reducedMotion);

  // Safety fallback for custom theme properties during hydration
  const modalBg =
    theme.palette?.background?.modalBackground ||
    theme.palette?.background?.paper;
  const textColor = theme.palette?.text?.primary;
  const divider = theme.palette?.custom?.border?.soft || theme.palette?.divider;
  const hoverState = theme.palette?.action?.hover;
  const modalShadow = theme.palette?.custom?.modalShadow;

  // Clamp the raw width value into a CSS string, then build a responsive
  // maxWidth that always fits inside the screen (with 2×p:2 = 32px margin).
  const maxW = width
    ? typeof width === "number"
      ? `${width}px`
      : width
    : "440px";

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        onClose?.();
      }}
      // ── Prevents body overflow:hidden + padding-right compensation that
      // shifts fixed-position siblings (Header, ChatInput, etc.) when the
      // modal opens. Background scrolling is blocked by the backdrop instead.
      disableScrollLock
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          style: {
            backdropFilter: reducedMotion ? "blur(4px)" : "blur(10px)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(7, 10, 14, 0.62)"
                : "rgba(15, 23, 42, 0.26)",
            transition: "all 200ms ease-out",
          },
        },
      }}
      // Flex-centred root — no translate(-50%,-50%) so no sub-pixel issues
      // at narrow widths. The `p` creates a safe inset from the viewport edge.
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <Box
        component={motion.div}
        initial={variants.initial}
        animate={open ? variants.animate : variants.exit}
        sx={{
          // ── Background & shape ──────────────────────────────────────────
          bgcolor: modalBg,
          border: `1px solid ${divider}`,
          boxShadow: modalShadow,
          borderRadius: { xs: "12px", sm: "10px" },

          width: "100%",
          maxWidth: {
            xs: "100%",   // full width inside the 1.5rem gutter
            sm: "min(80vw, 520px)",
            md: maxW,
          },

          maxHeight: { xs: "92svh", md: "90vh" },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // clip rounded corners on children

          // Remove focus ring injected by Framer Motion
          outline: "none",
          "&:focus-visible": { outline: "none" },
        }}
      >
        {/* ── Fixed close button (does not scroll with content) ── */}
        <Box
          sx={{
            flexShrink: 0,
            position: "relative",
            height: "40px",
            // The X is absolutely positioned within this slim header strip
          }}
        >
          <Box
            role="button"
            aria-label="Close"
            tabIndex={0}
            onClick={onClose}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClose?.()}
            sx={{
              position: "absolute",
              top: "8px",
              right: "12px",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              transition: "background-color 0.2s ease, transform 0.2s ease",
              zIndex: 10,
              // 44×44 touch target without affecting visual size
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-6px",
              },
              "&:hover": {
                backgroundColor: hoverState,
                transform: "scale(1.06)",
              },
            }}
          >
            <X size={20} color={textColor} strokeWidth={2.5} />
          </Box>
        </Box>

        {/* ── Scrollable content area ── */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: { xs: 2, sm: 2.5, md: 3 },
            pt: 0, // top spacing comes from the close-button strip above
            // Reuse the app-wide scrollbar utility for visual consistency
            ...scrollbarStyles(theme),
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default GenericModalWrapper;
