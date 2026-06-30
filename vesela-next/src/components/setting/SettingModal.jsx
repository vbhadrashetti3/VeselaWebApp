"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Grid,
  Box,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { X } from "lucide-react";

import SubscriptionContent from "./SubscriptionContent";
import AppearanceContent from "./AppearanceContent";
import PrivacyContent from "./PrivacyContent";
import AboutContent from "./AboutContent";
import TermsContent from "./TermsContent";
import FAQContent from "./FAQContent";
import SupportContent from "./SupportContent";
import DeleteContent from "./DeleteContent";
import ModelCardContent from "./ModelCardContent";
import { SETTINGS_MODAL } from "../modals/modalConstants";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useLogout } from "@/hooks/useLogout";
import { scrollbarStyles } from "@/utils/scrollbar";

const SettingsModal = ({ open, onClose }) => {
  const theme = useTheme();

  // VeselaAI uses theme.breakpoints.down("md") — we keep the same breakpoint
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { logout } = useLogout();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(SETTINGS_MODAL.MySubscription);

  const logoutUser = async () => {
    setLoading(true);
    await logout(onClose);
    setLoading(false);
  };

  const handleTabChange = (_, newValue) => {
    if (newValue === SETTINGS_MODAL.Logout) {
      logoutUser();
    } else {
      setActiveSection(newValue);
    }
  };

  const handleSideBarNavLink = (value) => {
    if (value === SETTINGS_MODAL.Logout) {
      logoutUser();
    } else {
      setActiveSection(value);
    }
  };



  const renderSection = () => {
    switch (activeSection) {
      case SETTINGS_MODAL.MySubscription:
        return <SubscriptionContent />;
      case SETTINGS_MODAL.Appearance:
        return <AppearanceContent />;
      case SETTINGS_MODAL.Privacy:
        return <PrivacyContent />;
      case SETTINGS_MODAL.Terms:
        return <TermsContent />;
      case SETTINGS_MODAL.About:
        return <AboutContent />;
      case SETTINGS_MODAL.ModelCard:
        return <ModelCardContent />;
      case SETTINGS_MODAL.FAQ:
        return <FAQContent />;
      case SETTINGS_MODAL.Support:
        return <SupportContent />;
      case SETTINGS_MODAL.Delete:
        return <DeleteContent />;
      default:
        return (
          <Typography color="text.secondary">Select a section</Typography>
        );
    }
  };

  // ─── Mobile tab items — migrated from VeselaAI ────────────────────────────
  const mobileTabItems = [
    { label: "Plan", value: SETTINGS_MODAL.MySubscription },
    { label: "Display", value: SETTINGS_MODAL.Appearance },
    { label: "Support", value: SETTINGS_MODAL.Support },
    { label: "FAQ", value: SETTINGS_MODAL.FAQ },
    { label: "Terms", value: SETTINGS_MODAL.Terms },
    { label: "Privacy", value: SETTINGS_MODAL.Privacy },
    { label: "About", value: SETTINGS_MODAL.About },
    { label: "Model Card", value: SETTINGS_MODAL.ModelCard },
    { label: "Delete", value: SETTINGS_MODAL.Delete },
    { label: "Logout", value: SETTINGS_MODAL.Logout, isLogout: true },
  ];



  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: isMobile ? 0 : 0.8,
          height: isMobile ? "100dvh" : "90vh",
          maxHeight: isMobile ? "100dvh" : "90vh",
          overflow: "hidden",
          backgroundColor: theme.palette.background.modalBackground,
          backgroundImage: "none",
        },
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  MOBILE LAYOUT                                                       */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {isMobile ? (
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            bgcolor: theme.palette.background.modalBackground,
          }}
        >
          {/* ── Mobile Header ── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              pt: 2.5,
              pb: 1.5,
              flexShrink: 0,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
              Settings
            </Typography>
            <IconButton
              onClick={onClose}
              aria-label="Close settings"
              sx={{ color: "text.primary" }}
            >
              <X size={24} />
            </IconButton>
          </Box>

          {/* ── Mobile Tabs — scrollable, migrated from VeselaAI ── */}
          <Box
            sx={{
              px: 1.5,
              flexShrink: 0,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs
              value={activeSection}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: 48,
                "& .MuiTabs-flexContainer": { gap: 0.5 },
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.text.primary,
                },
                "& .MuiTab-root": {
                  color: theme.palette.text.secondary,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  minWidth: "fit-content",
                  whiteSpace: "nowrap",
                  minHeight: 48,
                  px: 1.5,
                  "&.Mui-selected": {
                    color: theme.palette.text.primary,
                  },
                },
              }}
            >
              {mobileTabItems.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  sx={
                    tab.isLogout
                      ? { color: `${theme.palette.error.main} !important` }
                      : {}
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* ── Mobile Scrollable Content ── */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              minHeight: 0,
              // iOS momentum scrolling — migrated from VeselaAI
              WebkitOverflowScrolling: "touch",
              px: 3,
              py: 3,
              // Safe-area inset padding for notched iOS devices — migrated from VeselaAI
              pb: "calc(env(safe-area-inset-bottom) + 24px)",
              ...scrollbarStyles(theme),
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box sx={{ width: "100%" }}>{renderSection()}</Box>
            )}
          </Box>
        </DialogContent>
      ) : (
        /* ════════════════════════════════════════════════════════════════════ */
        /*  TABLET & DESKTOP LAYOUT                                            */
        /* ════════════════════════════════════════════════════════════════════ */
        <>
          {/* Desktop close button — absolute positioned above content */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 20,
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={onClose}
              aria-label="Close settings"
              sx={{
                color: theme.palette.text.primary,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  transform: "rotate(90deg)",
                },
              }}
            >
              <X />
            </IconButton>
          </Box>

          <DialogContent
            sx={{
              p: 0,
              flex: 1,
              display: "flex",
              overflow: "hidden",
              overflowX: "hidden",
              bgcolor: theme.palette.background.modalBackground,
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <CircularProgress size={24} />
              </Box>
            ) : (
              /* Grid layout — sidebar (md:3) + content (md:9), matches VeselaAI */
              <Grid
                container
                spacing={0}
                sx={{ flex: 1, minHeight: 0 }}
              >
                {/* Sidebar column */}
                <Grid
                  size={{ xs: 12, md: 3 }}
                  sx={{
                    height: "100%",
                    borderRight: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Sidebar
                    activeSection={activeSection}
                    handleClick={handleSideBarNavLink}
                  />
                </Grid>

                {/* Main content column */}
                <Grid
                  size={{ xs: 12, md: 9 }}
                  sx={{ height: "100%", overflow: "hidden" }}
                >
                  <MainContent renderSection={renderSection} />
                </Grid>
              </Grid>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default SettingsModal;
