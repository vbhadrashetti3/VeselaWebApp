"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import PricingPlansContent from "../pricing/PricingPlansContent";
import SettingSection from "./SettingSection";
import ManagePlanButton from "../subscription/ManagePlanButton";
import { useAuth } from "@/context/AuthContext";

const SubscriptionContent = () => {
  const { canManageStripeBilling } = useAuth();

  return (
    <SettingSection
      title="My Subscription"
      description="Manage your plan and usage limits"
    >
      <PricingPlansContent mdSize={6} />

      {canManageStripeBilling && (
        <Box
          sx={{
            mt: 2,
            mx: { xs: 1.5, md: 2 },
            p: 2,
            borderRadius: 1,
            bgcolor: "background.paper",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Subscription Actions
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Manage your payment methods, view invoices, or update your subscription via Stripe.
            </Typography>
          </Box>
          <ManagePlanButton />
        </Box>
      )}
    </SettingSection>
  );
};

export default SubscriptionContent;
