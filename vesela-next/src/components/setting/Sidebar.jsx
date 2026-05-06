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
} from "lucide-react";
import { SETTINGS_MODAL } from "../modals/modalConstants";

const Sidebar = ({ activeSection, handleClick }) => {
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
    { text: "FAQ", value: SETTINGS_MODAL.FAQ, icon: <NotepadText size={16} /> },
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
    {
      text: "About Grey Sky AI",
      value: SETTINGS_MODAL.About,
      icon: <Info size={16} />,
    },
    { text: "Other", section: "Other" },
    {
      text: "Delete Account",
      value: SETTINGS_MODAL.Delete,
      icon: <UserX size={16} />,
    },
    {
      text: "Logout",
      value: SETTINGS_MODAL.Logout,
      logout: true,
      icon: <LogOut size={16} />,
    },
  ];

  return (
    <Box sx={{ p: 2, height: "100%", overflowY: "auto" }}>
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
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                  mb: 0,
                  p: "2px 16px",

                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                  mt: item.logout ? 1.5 : 0,
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: item.logout ? theme.palette.error.main : "inherit",
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
                    color: item.logout ? theme.palette.error.main : "inherit",
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
