"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";

import PricingPlansContent from "../pricing/PricingPlansContent";
import AppearanceContent from "./AppearanceContent";
import PrivacyContent from "./PrivacyContent";
import AboutContent from "./AboutContent";
import TermsContent from "./TermsContent";
import FAQContent from "./FAQContent";
import SupportContent from "./SupportContent";
import DeleteContent from "./DeleteContent";
import { SETTINGS_MODAL } from "../modals/modalConstants";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useLogout } from "@/hooks/useLogout";

const SettingsModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { logout, isLoggingOut } = useLogout();
  const [activeSection, setActiveSection] = useState(
    SETTINGS_MODAL.MySubscription,
  );

  const handleSideBarNavLink = (value) => {
    if (value === SETTINGS_MODAL.Logout) {
      logout(onClose);
    } else {
      setActiveSection(value);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case SETTINGS_MODAL.MySubscription:
        return <PricingPlansContent />;
      case SETTINGS_MODAL.Appearance:
        return <AppearanceContent />;
      case SETTINGS_MODAL.Privacy:
        return <PrivacyContent />;
      case SETTINGS_MODAL.Terms:
        return <TermsContent />;
      case SETTINGS_MODAL.About:
        return <AboutContent />;
      case SETTINGS_MODAL.FAQ:
        return <FAQContent />;
      case SETTINGS_MODAL.Support:
        return <SupportContent />;
      case SETTINGS_MODAL.Delete:
        return <DeleteContent />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">Select a section</Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="lg"
      PaperProps={{
        sx: {
          height: isMobile ? "100%" : "85vh",
          maxHeight: isMobile ? "100%" : "800px",
          borderRadius: isMobile ? 0 : "8px",
          overflow: "hidden",
        },
      }}
    >
      {/* Close Button */}
      <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          height: "100%",
          overflow: "hidden", // ✅ IMPORTANT
          bgcolor: theme.palette.background.modalBackground,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            height: "100%", // ✅ IMPORTANT
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: 280 },
              minWidth: { md: 280 },
              // Chip-row fits in ~54px on mobile; full height on desktop
              maxHeight: { xs: 54, md: "none" },
              borderRight: { md: `1px solid ${theme.palette.divider}` },
              borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: "none" },
              overflowY: { xs: "hidden", md: "hidden" },
              flexShrink: 0,
            }}
          >
            <Sidebar
              activeSection={activeSection}
              handleClick={handleSideBarNavLink}
              compact={isMobile}
            />
          </Box>

          {/* Main Content Wrapper */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              display: "flex",
              p: 0,
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <MainContent renderSection={renderSection} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
