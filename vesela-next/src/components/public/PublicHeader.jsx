"use client";

import { useState } from "react";
import Link from "next/link";
import Lottie from "lottie-react";

import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import { Sun, Moon } from "lucide-react";

import { useModal } from "@/context/ModalContext";
import { useColorMode } from "@/theme/ThemeRegistry";
import { MODALS } from "../modals/modalConstants";

import VeselaLogoBlack from "../../../public/vesela_black_lottie.json";
import VeselaLogoWhite from "../../../public/vesela_white_lottie.json";

const menus = [
  {
    label: "Humanity Bench",
    href: "/humanity-bench",
  },
  {
    label: "Graysky AI",
    href: "/graysky-ai",
  },
  {
    label: "Alignment AI",
    href: "/alignment-ai",
  },
];

export default function PublicHeader() {
  const { openModal } = useModal();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignIn = () => {
    openModal(MODALS.LOGIN);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: theme.palette.custom?.header?.background ?? "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.palette.custom?.header?.border ?? "rgba(0,0,0,0.08)"}`,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, md: 8 },
            minHeight: "72px",
          }}
        >
          {/* LOGO */}
          <Box
            sx={{
              height: "65px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              ml: { xs: "-55px", md: "0" },
            }}
          >
            <Lottie
              animationData={theme.palette.mode === "dark" ? VeselaLogoWhite : VeselaLogoBlack}
              loop={false}
              style={{
                width: "220px",
                transform: "scale(1.1)",
                transformOrigin: "center",
                marginTop: "12px",
              }}
            />
          </Box>

          {/* RIGHT SIDE */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* DESKTOP MENUS */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              {menus.map((menu) => (
                <Button
                  key={menu.label}
                  component={Link}
                  href={menu.href}
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "15px",
                  }}
                >
                  {menu.label}
                </Button>
              ))}
            </Stack>

            {/* Theme Toggle Button */}
            <IconButton
              onClick={toggleColorMode}
              sx={{
                color: "text.primary",
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
              aria-label="Toggle light/dark theme"
            >
              {theme.palette.mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>

            {/* DESKTOP SIGN IN */}
            <Button
              variant="contained"
              onClick={handleSignIn}
              type="button"
              sx={{
                borderRadius: "50px",
                px: 4,
                display: { xs: "none", md: "flex" },
              }}
            >
              Sign In
            </Button>

            {/* MOBILE MENU ICON */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "text.primary",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box
          sx={{
            width: 270,
            pt: 2,
            height: "100%",
            bgcolor: "background.paper",
            color: "text.primary",
          }}
        >
          <List>
            {menus.map((menu) => (
              <ListItemButton
                key={menu.label}
                component={Link}
                href={menu.href}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={menu.label} />
              </ListItemButton>
            ))}

            <Box sx={{ px: 2, mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  handleSignIn();
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: "50px",
                }}
              >
                Sign In
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

