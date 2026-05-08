"use client";

import {
  Box,
  Container,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function GuestLimitBanner({
  open,
  onClick,
}) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 92,
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="md">
        <Box
          role="button"
          onClick={onClick}
          sx={{
            p: 1.2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            backdropFilter: "blur(12px)",
            boxShadow: 3,
          }}
        >
          <LockOutlinedIcon
            fontSize="small"
            color="primary"
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Free guest limit reached. Login or
            upgrade to continue.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}