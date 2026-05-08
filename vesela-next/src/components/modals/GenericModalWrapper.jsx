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
    theme.palette?.background?.paper ||
    "#ffffff";
  const textColor = theme.palette?.text?.primary || "#000000";
  const divider = theme.palette?.custom?.border?.soft || theme.palette?.divider;
  const hoverState =
    theme.palette?.action?.hover ||
    (theme.palette?.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.05)");
  const modalShadow =
    theme.palette?.custom?.modalShadow || "0 20px 52px rgba(0,0,0,0.16)";

  const modalWidth = width ?? "420px";

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        // Prevent closing when clicking outside (UX choice)
        if (reason === "backdropClick") return;
        onClose?.();
      }}
      disableScrollLock
      keepMounted
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
    >
      {/* Centering wrapper: keeps translate transform stable while Framer Motion animates the panel */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          component={motion.div}
          initial={variants.initial}
          animate={open ? variants.animate : variants.exit}
          sx={{
            // Background & Shape
            bgcolor: modalBg,
            border: `1px solid ${divider}`,
            boxShadow: modalShadow,
            borderRadius: 2,
            p: { xs: 2.5, md: 4 },

            // Responsive Sizing
            width: {
              xs: "92%",
              sm: "80%",
              md: modalWidth,
            },
            maxWidth: "100%",

            // Height & Scrolling logic
            minHeight: minHeight ?? "auto",
            height: {
              xs: height ? height : "auto",
              sm: height ? height : "auto",
            },
            maxHeight: "90vh",
            overflowY: "auto",

            outline: "none",
            "&:focus-visible": { outline: "none" },
          }}
        >
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
      </Box>
    </Modal>
  );
};

export default GenericModalWrapper;
