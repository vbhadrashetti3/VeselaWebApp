"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  useTheme,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { useDeleteAccount } from "@/hooks/useDeleteAccount"; // Adjust path as needed

const DeleteContent = () => {
  const theme = useTheme();
  const [openDeleteModal, setDeleteModal] = useState(false);

  // Use the custom hook
  const { deleteAccount, isDeleting } = useDeleteAccount();

  const handleDeleteHandler = () => setDeleteModal(true);
  const handleClose = () => !isDeleting && setDeleteModal(false); // Prevent closing while deleting

  const onConfirmDelete = async () => {
    const success = await deleteAccount();
    if (!success) {
      // Optional: Handle error UI here if you don't want to use the hook's error state
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Danger Zone
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Deleting your account will permanently remove all your chat history,
        subscription details, and personal data.
      </Typography>

      <Button
        variant="contained"
        color="error"
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          height: "45px",
        }}
        onClick={handleDeleteHandler}
      >
        Delete Account
      </Button>

      <Modal
        open={openDeleteModal}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || isDeleting) return;
          handleClose();
        }}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
              sx: {
              backdropFilter: "blur(4px)",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(7, 10, 14, 0.72)"
                  : "rgba(15, 23, 42, 0.36)",
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
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 4,
            boxShadow: theme.palette.custom?.modalShadow ?? "0 20px 52px rgba(0,0,0,0.16)",
            border: `1px solid ${theme.palette.divider}`,
            textAlign: "center",
          }}
        >
          <Box sx={{ color: "error.main", mb: 2 }}>
            <AlertTriangle size={48} strokeWidth={1.5} />
          </Box>

          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            Irreversible Action
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 3, color: "text.secondary", lineHeight: 1.6 }}
          >
            Are you sure you want to delete your account? This will wipe all
            your data and cannot be undone.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClose}
              disabled={isDeleting}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={onConfirmDelete}
              disabled={isDeleting}
              startIcon={
                isDeleting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DeleteContent;
