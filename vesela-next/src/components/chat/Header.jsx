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
import GraceLogo from "../../../public/Grace-Logo-Bars.json";
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
      action: () => console.log("New Chat Clicked", Date.now()), // Replace with actual action
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
        border: 0,
        bgcolor: theme.palette.custom.header.background,
        color: "#ffffff",
        boxShadow: "none"
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: CHAT_CONTAINER_MAX_WIDTH, width: "100%" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0 !important",
            minHeight: "64px",
            position: "relative",
          }}
        >
          {/* Left spacer so logo absolute centering is relative to the toolbar */}
          <Box sx={{ width: 40 }} />

          {/* Centered GraceLogo */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <GenreicLottie animationData={GraceLogo} width={100} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              transformOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: 1.2,
                    minWidth: 200,
                    overflow: "hidden",
                    borderRadius: "10px",

                    bgcolor: theme.palette.background.paper,

                    border: `1px solid ${theme.palette.divider}`,

                    boxShadow: theme.palette.custom.shadow,

                    backdropFilter: "blur(12px)",

                    py: 0.5,
                  },
                },
              }}
            >
              {headerMenuItems.map((item) => {
                const content = (
                  <MenuItem
                    key={item.label}
                    disabled={item.disabled}
                    onClick={() => {
                      item.action();
                      handleCloseMenu();
                    }}
                    sx={{
                      mx: 0.5,
                      my: 0.3,
                      px: 1.4,
                      py: 1.1,

                      borderRadius: "0px",

                      color: theme.palette.text.primary,

                      transition: "all 0.18s ease",

                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                      },

                      "&.Mui-disabled": {
                        opacity: 0.45,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 34,

                        "& svg": {
                          fontSize: 20,
                        },
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

                if (item.disabled && item.tooltip) {
                  return (
                    <Tooltip
                      key={item.label}
                      title={item.tooltip}
                      placement="left"
                      arrow
                    >
                      <Box>{content}</Box>
                    </Tooltip>
                  );
                }

                return content;
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
