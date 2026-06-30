"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
} from "@mui/material";
import { useColorMode } from "@/theme/ThemeRegistry";
import { Sun, Moon } from "lucide-react";
import SettingSection from "./SettingSection";

const AppearanceContent = () => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <SettingSection
      title="Appearance"
      description="Adjust how the interface looks on your device."
    >
      <List
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          width: "100%",
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
    </SettingSection>
  );
};

export default AppearanceContent;
