"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText, 
  Button,
} from "@mui/material";
import { Add, History, Settings, Upgrade } from "@mui/icons-material";

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "#111118",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List sx={{ flexGrow: 1 }}>
        <ListItemButton sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.05)" }}>
          <ListItemIcon>
            <Add sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="New Chat"
            primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
          />
        </ListItemButton>

        {["History", "Settings"].map((text, index) => (
          <ListItemButton key={text} sx={{ borderRadius: 1.5 }}>
            <ListItemIcon>
              {index === 0 ? (
                <History sx={{ color: "gray" }} />
              ) : (
                <Settings sx={{ color: "gray" }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{ fontSize: 13, color: "gray" }}
            />
          </ListItemButton>
        ))}
      </List>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<Upgrade />}
        sx={{ borderColor: "#333", color: "white", textTransform: "none" }}
      >
        Upgrade to Pro
      </Button>
    </Box>
  );
}
