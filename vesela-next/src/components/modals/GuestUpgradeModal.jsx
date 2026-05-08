"use client";

import { Box, Stack, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "./modalConstants";
import GenericModalWrapper from "./GenericModalWrapper";
import CustomButton from "../ui/CustomButton";

const GuestUpgradeModal = ({ open, onClose }) => {
  const { openModal } = useModal();

  const handleLogin = () => {
    onClose?.();
    openModal(MODALS.LOGIN);
  };

  const handleUpgrade = () => {
    onClose?.();
    openModal(MODALS.PLANS);
  };

  return (
    <GenericModalWrapper open={open} onClose={onClose} width="460px">
      <Stack spacing={2.2}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <LockOutlinedIcon color="primary" />
          </Box>
        </Box>

        <Typography variant="h6" textAlign="center">
          Guest limit reached
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          You have used 6 free guest prompts. Log in to continue chatting or upgrade for premium access.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <CustomButton fullWidth onClick={handleLogin}>
            Login to continue chatting
          </CustomButton>
          <CustomButton
            fullWidth
            onClick={handleUpgrade}
            sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "primary.dark" } }}
          >
            Upgrade your plan
          </CustomButton>
        </Stack>
      </Stack>
    </GenericModalWrapper>
  );
};

export default GuestUpgradeModal;
