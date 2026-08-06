"use client";

import React, { useState } from "react";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getCustomerBillingPortal } from "@/services/billing.service";

/**
 * ManagePlanButton Component
 * Renders a "Manage Plan" button that opens the Stripe Billing Portal in a new tab.
 * Includes loading, duplicate-click prevention, keyboard accessibility, and error toasts.
 */
export default function ManagePlanButton({
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  sx = {},
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "error" });

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleManagePlan = async (e) => {
    e?.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await getCustomerBillingPortal();

      // Check for network/API client errors
      if (res?.error) {
        setToast({
          open: true,
          message: res.message || "Failed to open billing portal. Please try again later.",
          severity: "error",
        });
        return;
      }

      const data = res?.data;

      // Handle session expiration
      if (data?.expired === true) {
        setToast({
          open: true,
          message: "Your billing portal session has expired. Please try again.",
          severity: "warning",
        });
        return;
      }

      // Success flow
      if (data?.status === "success" && data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        setToast({
          open: true,
          message: data?.message || "Unexpected response from billing server. Please try again.",
          severity: "error",
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err?.message || "An unexpected error occurred while accessing the billing portal.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        color={color}
        size={size}
        fullWidth={fullWidth}
        disabled={loading}
        onClick={handleManagePlan}
        aria-label="Manage Plan on Stripe Billing Portal"
        aria-busy={loading}
        startIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <OpenInNewIcon sx={{ fontSize: 16 }} />
          )
        }
        sx={{
          borderRadius: 1,
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.2s ease-in-out",
          ...(loading && {
            cursor: "not-allowed",
          }),
          ...sx,
        }}
      >
        {loading ? "Opening Portal..." : "Manage Plan"}
      </Button>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
