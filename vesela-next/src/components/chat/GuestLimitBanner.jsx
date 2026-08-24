"use client";

import {
  Box,
  Container,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { CHAT_CONTAINER_MAX_WIDTH } from "@/constant";

export default function GuestLimitBanner({
  open,
  onClick,
  message = "Free guest limit reached. Login or upgrade to continue.",
  variant = "card",
}) {
  if (!open) return null;

  const isLabel = variant === "label";

  return (
    <Box
      sx={{
        position: "fixed",
        // Match ChatInput's responsive pb: { xs: 2, sm: 4 } + input height (~56px)
        bottom: { xs: 72, sm: 92 },
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%" }}>
        <Box
          role="button"
          onClick={onClick}
          sx={
            isLabel
              ? {
                  px: 2,
                  py: 0.75,
                  cursor: "pointer",
                  background: "transparent",
                  border: 0,
                  boxShadow: "none",
                }
              : {
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
                }
          }
        >
          {!isLabel && (
            <LockOutlinedIcon
              fontSize="small"
              color="primary"
            />
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              width: "100%",
              textAlign: isLabel ? "center" : "left",
            }}
          >
            {message}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
