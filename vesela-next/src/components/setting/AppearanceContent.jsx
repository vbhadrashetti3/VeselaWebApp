"use client";

import React from "react";
import {
  Box,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useColorMode } from "@/theme/ThemeRegistry"; // Adjust path as needed
import { Sun, Moon } from "lucide-react";

const AppearanceContent = () => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Appearance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Adjust how the interface looks on your device.
      </Typography>

      <List
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <ListItem
          secondaryAction={
            <Switch
              edge="end"
              onChange={toggleColorMode}
              checked={mode === "dark"}
            />
          }
        >
          <ListItemIcon sx={{ color: "primary.main", minWidth: 45 }}>
            {mode === "dark" ? <Moon size={22} /> : <Sun size={22} />}
          </ListItemIcon>
          <ListItemText
            primary="Dark Mode"
            secondary={
              mode === "dark"
                ? "Dark theme currently active"
                : "Light theme currently active"
            }
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default AppearanceContent;
