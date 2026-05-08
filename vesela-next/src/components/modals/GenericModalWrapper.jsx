"use client";

import React from "react";
import { Box, Modal, useTheme, Backdrop } from "@mui/material";
import { X } from "lucide-react";

const GenericModalWrapper = ({
  open,
  onClose,
  children,
  width,
  height,
  minHeight,
}) => {
  const theme = useTheme();

  // Safety fallback for custom theme properties during hydration
  const modalBg =
    theme.palette?.background?.modalBackground ||
    theme.palette?.background?.paper ||
    "#ffffff";
  const textColor = theme.palette?.text?.primary || "#000000";

  const modalWidth = width ?? "420px";

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        // Prevent closing when clicking outside (UX choice)
        if (reason === "backdropClick") return;
        onClose?.();
      }}
      disableScrollLock // Keeps the page scrollbar from jumping
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          style: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          // Background & Shape
          bgcolor: modalBg,
          boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
          borderRadius: "10px", // Softer UX
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
          overflowY: "auto", // Allows internal scroll if content is long

          // UI Polish
          outline: "none",
          transition: "all 0.3s ease-in-out",
          "&:focus-visible": { outline: "none" },
        }}
      >
        {/* Modern Close Button */}
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
            transition: "background-color 0.2s",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }}
        >
          <X size={20} color={textColor} strokeWidth={2.5} />
        </Box>

        {/* Modal Content */}
        <Box sx={{ mt: height ? 0 : 1 }}>{children}</Box>
      </Box>
    </Modal>
  );
};

export default GenericModalWrapper;
