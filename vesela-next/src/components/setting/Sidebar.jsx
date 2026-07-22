"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme,
  alpha,
  Chip,
  Stack,
} from "@mui/material";
import {
  CreditCard,
  Info,
  Key,
  LockKeyhole,
  LogOut,
  NotepadText,
  Sun,
  User,
  UserX,
  BookOpen,
} from "lucide-react";
import { SETTINGS_MODAL } from "../modals/modalConstants";
import { scrollbarStyles } from "@/utils/scrollbar";

// ─── Sidebar ───────────────────────────────────────────────────────────────────
// Migration changes from VeselaAI:
//   • Added `BookOpen` icon + ModelCard entry (was missing entirely)
//   • Added `scrollbarStyles` to desktop sidebar Box (was missing)
//   • Updated "Support" → "Support (Discord)" to match VeselaAI label
//   • ModelCard positioned between "About" and the "Other" section header

const Sidebar = ({ activeSection, handleClick, compact = false }) => {
  const theme = useTheme();

  const sidebarItems = [
    { text: "General", section: "General" },
    {
      text: "My Subscription",
      value: SETTINGS_MODAL.MySubscription,
      icon: <CreditCard size={16} />,
    },
    {
      text: "Support (Discord)",
      value: SETTINGS_MODAL.Support,
      icon: <User size={16} />,
    },
    {
      text: "Appearance",
      value: SETTINGS_MODAL.Appearance,
      icon: <Sun size={16} />,
    },
    { text: "About", section: "About" },
    {
      text: "FAQ",
      value: SETTINGS_MODAL.FAQ,
      icon: <NotepadText size={16} />,
    },
    {
      text: "Terms of Use",
      value: SETTINGS_MODAL.Terms,
      icon: <Key size={16} />,
    },
    {
      text: "Privacy Policy",
      value: SETTINGS_MODAL.Privacy,
      icon: <LockKeyhole size={16} />,
    },
    // Migrated from VeselaAI — was missing in Vesela
    {
      text: "Vesela Model Card",
      value: SETTINGS_MODAL.ModelCard,
      icon: <BookOpen size={16} />,
    },
    { text: "Other", section: "Other" },
    {
      text: "Delete Account",
      value: SETTINGS_MODAL.Delete,
      icon: <UserX size={16} />,
      danger: true,
    },
    {
      text: "Logout",
      value: SETTINGS_MODAL.Logout,
      logout: true,
      danger: true,
      icon: <LogOut size={16} />,
    },
  ];

  // ─── COMPACT MODE: horizontal scrollable tab-chip row for mobile ───────────
  // Used when compact=true (mobile). Filters out section headers and shows
  // only navigable items as scrollable chips.
  if (compact) {
    const navItems = sidebarItems.filter((item) => !item.section);
    return (
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          // Hide the scrollbar visually but keep it functional
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          px: 1.5,
          py: 1,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ width: "max-content" }}>
          {navItems.map((item, idx) => {
            const isSelected = activeSection === item.value;
            return (
              <Chip
                key={idx}
                icon={
                  <Box
                    sx={{
                      color: item.danger
                        ? theme.palette.error.main
                        : isSelected
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.secondary,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                }
                label={item.text}
                onClick={() => handleClick(item.value)}
                variant={isSelected ? "filled" : "outlined"}
                color={item.danger ? "error" : isSelected ? "primary" : "default"}
                size="small"
                sx={{
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: "12px",
                  height: 32,
                  cursor: "pointer",
                  borderColor: item.danger
                    ? theme.palette.error.main
                    : isSelected
                      ? "transparent"
                      : theme.palette.divider,
                  "& .MuiChip-label": { px: 1 },
                  "& .MuiChip-icon": { ml: 0.5 },
                  transition: "all 0.15s ease",
                }}
              />
            );
          })}
        </Stack>
      </Box>
    );
  }

  // ─── FULL MODE: vertical list for tablet and desktop ─────────────────────
  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        overflowY: "auto",
        boxSizing: "border-box",
        // Migrated from VeselaAI: custom scrollbar styling on the sidebar
        ...scrollbarStyles(theme),
      }}
    >
      <List dense disablePadding>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            mb: 2,
            px: 1,
            color: "text.primary",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        >
          Settings
        </Typography>

        {sidebarItems.map((item, idx) => {
          const isSelected = activeSection === item.value;

          if (item.section) {
            return (
              <ListItem
                key={`section-${idx}`}
                disablePadding
                sx={{ mt: idx !== 0 ? 2 : 0, mb: 1, px: 1 }}
              >
                <ListItemText
                  primary={item.section}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "11px",
                    color: "text.disabled",
                    textTransform: "uppercase",
                  }}
                />
              </ListItem>
            );
          }

          return (
            <ListItem key={`item-${idx}`} disablePadding sx={{ mb: 0 }}>
              <ListItemButton
                onClick={() => handleClick(item.value)}
                selected={isSelected}
                sx={{
                  borderRadius: "6px",
                  transition: "all 0.18s ease",
                  mb: 0,
                  p: "6px 12px",
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  },
                  mt: item.logout ? 1.5 : 0,
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: item.danger
                        ? theme.palette.error.main
                        : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: "13px",
                    color: item.danger
                      ? theme.palette.error.main
                      : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
