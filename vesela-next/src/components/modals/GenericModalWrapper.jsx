"use client";

import React from "react";
import { Box, Modal, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GenericModalWrapper = ({
  open,
  onClose,
  children,
  width = 420,
  height = "auto",
  minHeight = "auto",
}) => {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        // prevent accidental close
        if (reason === "backdropClick") return;
        onClose?.();
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.4)",
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

          width: {
            xs: width,
            sm: "80%",
            md: width,
          },

          maxWidth: "95vw",
          maxHeight: "90vh",

          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 24,
          p: 2.5,

          minHeight: minHeight,

          overflowY: "auto",
          outline: "none",
        }}
      >
        {/* Close Button (Accessible) */}
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: theme.palette.text.primary,
          }}
        >
          <CloseIcon />
        </IconButton>

        {children}
      </Box>
    </Modal>
  );
};

export default GenericModalWrapper;
