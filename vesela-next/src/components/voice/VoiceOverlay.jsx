"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { Menu, Settings, X } from "lucide-react";
import { useState } from "react";

import HistoryModal from "@/components/chat-history/HistoryModal";
import SettingsModal from "@/components/setting/SettingModal";
import VoiceOrb from "@/components/voice/VoiceOrb";

function CircleIconButton({ label, icon: Icon, onClick, size = 48, iconSize, color, borderColor }) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        border: "1px solid",
        borderColor,
        color,
        "&:hover": {
          backgroundColor: "rgba(127, 127, 127, 0.08)",
        },
      }}
    >
      <Icon size={iconSize || (size >= 54 ? 24 : 21)} strokeWidth={1.65} />
    </IconButton>
  );
}

export default function VoiceOverlay({
  themeMode = "dark",
  activityLevel = 0,
  error = null,
  onClose,
}) {
  const isDark = themeMode !== "light";
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const canvas = isDark ? "#0A0A0A" : "#F7F7F5";
  const ink = isDark ? "#FFFFFF" : "#0A0A0A";
  const hairline = isDark ? "rgba(255,255,255,0.28)" : "rgba(10,10,10,0.24)";

  return (
    <Box
      role="dialog"
      aria-label="Audio conversation"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal - 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: canvas,
        color: ink,
        borderColor: hairline,
      }}
    >
      <Box
        sx={{
          minHeight: 76,
          px: 2.5,
          pt: 1.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <CircleIconButton
          label="Open menu"
          icon={Menu}
          onClick={() => setHistoryOpen(true)}
          color={ink}
          borderColor={hairline}
        />
        <CircleIconButton
          label="Open settings"
          icon={Settings}
          onClick={() => setSettingsOpen(true)}
          color={ink}
          borderColor={hairline}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 1.5,
        }}
      >
        <Box
          sx={{
            width: "min(620px, 88vw, 64vh)",
            height: "min(620px, 88vw, 64vh)",
          }}
        >
          <VoiceOrb key={themeMode} themeMode={themeMode} activityLevel={activityLevel} />
        </Box>
        {error ? (
          <Typography
            sx={{
              mt: 2,
              px: 3,
              maxWidth: 420,
              textAlign: "center",
              fontSize: 13,
              lineHeight: 1.4,
              color: "#FF7A17",
            }}
          >
            {error}
          </Typography>
        ) : null}
      </Box>

      <Box
        sx={{
          minHeight: 104,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 1.5,
        }}
      >
        <CircleIconButton
          label="Close audio conversation"
          icon={X}
          onClick={onClose}
          size={58}
          color={ink}
          borderColor={hairline}
        />
      </Box>

      {historyOpen && (
        <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
      )}
      {settingsOpen && (
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}
    </Box>
  );
}
