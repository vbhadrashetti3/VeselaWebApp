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

import { useModal } from "@/context/ModalContext";
import { MODALS } from "../modals/modalConstants";

import VeselaLogoBlack from "../../../public/vesela_black_lottie.json";

const menus = [
  {
    label: "Humanity Bench",
    href: "https://humanitybench.org/",
    external: true,
  },
  {
    label: "Graysky AI",
    href: "https://grayskyai.com/",
    external: true,
  },
  {
    label: "Alignment AI",
    href: "https://humanalignmentai.com/",
    external: true,
  },
];

/**
 * Public site header — always light mode.
 * The theme toggle has been removed; dark mode is not available on the public website.
 */
export default function PublicHeader() {
  const { openModal } = useModal();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignIn = () => {
    openModal(MODALS.LOGIN, { source: "public" });
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          border: 0,
          bgcolor: theme.palette.custom.header.background,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.palette.custom.header.border}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, md: 8 },
            minHeight: "72px",
          }}
        >
          {/* LOGO — always use the black (light-mode) logo */}
          <Box
            sx={{
              height: "65px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Lottie
              animationData={VeselaLogoBlack}
              loop={false}
              style={{
                width: "120px",
                marginTop: "10px",
                marginLeft: "-12px", // compensates internal Lottie left padding
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
                  target={menu.external ? "_blank" : undefined}
                  rel={menu.external ? "noopener noreferrer" : undefined}
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
                target={menu.external ? "_blank" : undefined}
                rel={menu.external ? "noopener noreferrer" : undefined}
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
