"use client";

import React from "react";
import { Box, Modal, useTheme, Backdrop } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { getModalContainerVariants } from "@/animations/modalMotionVariants";

const GenericModalWrapper = ({
  open,
  onClose,
  children,
  width,
  height,
  minHeight,
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

  const modalWidth = width ?? "420px";

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        // Prevent closing when clicking outside (UX choice)
        if (reason === "backdropClick") return;
        onClose?.();
      }}
      // NOTE: keep scroll lock ON so background doesn't scroll behind modal on mobile
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
      // Use flex centering on the Modal root — avoids transform-based centering
      // that can produce sub-pixel clipping at 320px widths.
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 }, // safe margin from screen edges
      }}
    >
      {/*
       * The motion panel. No more position:absolute + translate(-50%,-50%).
       * The Modal root is a flex container so this centers naturally.
       */}
      <Box
        component={motion.div}
        initial={variants.initial}
        animate={open ? variants.animate : variants.exit}
        sx={{
          // Background & Shape
          bgcolor: modalBg,
          border: `1px solid ${divider}`,
          boxShadow: modalShadow,
          borderRadius: "10px",
          p: { xs: 2.5, md: 4 },

          // Responsive Sizing
          width: {
            xs: "100%",     // fills the flex parent up to the p:2 margin
            sm: "80%",
            md: modalWidth,
          },
          // Hard cap so it never overflows on tiny screens
          maxWidth: modalWidth,

          // Height & Scrolling
          minHeight: minHeight ?? "auto",
          height: {
            xs: height ? height : "auto",
            sm: height ? height : "auto",
          },
          // svh = small viewport height — accounts for mobile browser chrome
          maxHeight: { xs: "90svh", md: "90vh" },
          overflowY: "auto",

          // Remove default focus outline from Framer Motion div
          outline: "none",
          "&:focus-visible": { outline: "none" },

          // Relative for the close button
          position: "relative",
        }}
      >
        {/* Close button */}
        <Box
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            cursor: "pointer",
            width: "32px",
            height: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            transition: "background-color 0.2s ease, transform 0.2s ease",
            zIndex: 10,
            // Larger touch target on mobile without changing visual size
            "&::before": {
              content: '""',
              position: "absolute",
              inset: "-8px",
            },
            "&:hover": {
              backgroundColor: hoverState,
              transform: "scale(1.04)",
            },
          }}
        >
          <X size={20} color={textColor} strokeWidth={2.5} />
        </Box>

        <Box sx={{ mt: height ? 0 : 1 }}>{children}</Box>
      </Box>
    </Modal>
  );
};

export default GenericModalWrapper;
