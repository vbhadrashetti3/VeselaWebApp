"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Grow,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Add as Plus,
  History,
  Settings,
  OpenInNew as Link,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import GenreicLottie from "../ui/GenericLottie";
import VeselaLogo from "../../../public/Grace-Logo-Bars.json";
import { CHAT_CONTAINER_MAX_WIDTH } from "@/constant";
import HistoryModal from "../chat-history/HistoryModal";
import SettingsModal from "../setting/SettingModal";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [historyModal, setHistoryModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const router = useRouter();
  const { logout } = useLogout();
  const { isAuthenticated } = useAuth();
  const token = isAuthenticated; // alias for menu item disabled checks
  const theme = useTheme();

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const headerMenuItems = [
    {
      label: "New Chat",
      icon: <Plus sx={{ fontSize: 18 }} />,
      action: () => router.push("/welcome"),
      disabled: !token,
      tooltip: "Please log in to start a new chat",
    },
    {
      label: "History",
      icon: <History sx={{ fontSize: 18 }} />,
      action: () => setHistoryModal(true),
      disabled: !token,
      tooltip: "Please log in to view history",
    },
    {
      label: "Settings",
      icon: <Settings sx={{ fontSize: 18 }} />,
      action: () => setSettingsModal(true),
      disabled: !token,
      tooltip: "Please log in to open settings",
    },

    {
      label: "Vesela",
      icon: <Link sx={{ fontSize: 18 }} />,
      action: () => router.push("/"),
      disabled: false,
    },
    ...(token
      ? [
        {
          label: "Logout",
          icon: <LogoutIcon sx={{ fontSize: 18 }} />,
          action: () => logout(),
          disabled: false,
        },
      ]
      : []),
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow: "none",
        border: 0
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%" }}>
        <Toolbar
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 40px",
            alignItems: "center",
            padding: "8px 0 !important",
            minHeight: { xs: "56px", sm: "64px" },
          }}
        >
          {/* Left spacer */}
          <Box />

          {/* Centered logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GenreicLottie animationData={VeselaLogo} width={100} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <IconButton
              color="inherit"
              onClick={handleOpenMenu}
              sx={{
                bgcolor: open
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
              }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              // ── (1) Prevent MUI from removing the scrollbar on open ──────────
              // disableScrollLock keeps the page width stable so the header
              // and chat container never shift when the menu is toggled.
              disableScrollLock
              // ── (2) Alignment: menu top-right corner meets button bottom-right
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              // ── (3) Subtle open/close animation via MUI Grow ─────────────────
              TransitionComponent={Grow}
              TransitionProps={{ timeout: { enter: 180, exit: 120 } }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    // Small gap between icon button and menu surface
                    mt: 0.75,
                    minWidth: 200,
                    overflow: "visible",
                    borderRadius: "12px",
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.custom.shadow,
                    backdropFilter: "blur(12px)",
                    // Clip children to rounded corners
                    "& .MuiList-root": { py: 0.75 },
                  },
                },
              }}
            >
              {headerMenuItems.map((item) => {
                const menuItem = (
                  <MenuItem
                    disabled={item.disabled}
                    onClick={() => {
                      item.action();
                      handleCloseMenu();
                    }}
                    sx={{
                      mx: 0.75,
                      my: 0.25,
                      px: 1.5,
                      py: 1,
                      borderRadius: "8px",
                      color: theme.palette.text.primary,
                      transition: "background-color 0.15s ease",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.06 : 0.12),
                      },
                      "&.Mui-disabled": { opacity: 0.45 },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 34,
                        "& svg": { fontSize: 18 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    />
                  </MenuItem>
                );

                // Wrap disabled items with a Tooltip; key goes on the root node
                if (item.disabled && item.tooltip) {
                  return (
                    <Tooltip
                      key={item.label}
                      title={item.tooltip}
                      placement="left"
                      arrow
                    >
                      <Box>{menuItem}</Box>
                    </Tooltip>
                  );
                }

                return <Box key={item.label}>{menuItem}</Box>;
              })}
            </Menu>
          </Box>
        </Toolbar>
        {historyModal && (
          <HistoryModal
            open={historyModal}
            onClose={() => setHistoryModal(false)}
          />
        )}
        {settingsModal && (
          <SettingsModal
            open={settingsModal}
            onClose={() => setSettingsModal(false)}
          />
        )}
      </Container>
    </AppBar>
  );
}
