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
import {
  Menu as MenuIcon,
  Add as Plus,
  History,
  Settings,
  OpenInNew as Link,
} from "@mui/icons-material";
import GenreicLottie from "../ui/GenericLottie";
import GraceLogo from "../../../public/Grace-Logo-Bars.json";
import { TOKEN } from "@/constant";
import HistoryModal from "../chat-history/HistoryModal";
import SettingsModal from "../setting/SettingModal";
import { localStorageUtil } from "@/utils/localStorageUtil";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [historyModal, setHistoryModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const token = localStorageUtil.get(TOKEN);

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
      label: "Grayskyai.com",
      icon: <Link sx={{ fontSize: 18 }} />,
      action: () => window.open("https://grayskyai.com"),
      disabled: false,
    },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "rgba(0, 0, 0)", // Black with transparency
        backdropFilter: "blur(12px)", // Enhanced glassmorphism
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="md">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0 !important",
            minHeight: "64px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <GenreicLottie animationData={GraceLogo} width={100} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              onClick={handleOpenMenu}
              sx={{ bgcolor: open ? "rgba(255,255,255,0.05)" : "transparent" }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: {
                  bgcolor: "#1e1e26", // Matching your ChatInput/Bubble colors
                  color: "white",
                  mt: 1.5,
                  minWidth: 180,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 2,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {headerMenuItems.map((item) => {
                const ItemContent = (
                  <MenuItem
                    key={item.label}
                    disabled={item.disabled}
                    onClick={() => {
                      item.action();
                      handleCloseMenu();
                    }}
                    sx={{
                      py: 1,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    />
                  </MenuItem>
                );

                return item.disabled && item.tooltip ? (
                  <Tooltip
                    key={item.label}
                    title={item.tooltip}
                    placement="left"
                    arrow
                  >
                    <Box>{ItemContent}</Box>
                  </Tooltip>
                ) : (
                  ItemContent
                );
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
