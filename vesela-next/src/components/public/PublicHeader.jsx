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
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useModal } from "@/context/ModalContext";
import { MODALS } from "../modals/modalConstants";

import VeselaLogoBlack from "../../../public/vesela_black_lottie.json";

const menus = [
  {
    label: "Humanity Bench",
    href: "https://humanitybench.org/",
    external: true,
    active: true,
  },
  {
    label: "Graysky AI",
    href: "https://grayskyai.com/",
    external: true,
    active: false,
  },
  {
    label: "Alignment AI",
    href: "https://humanalignmentai.com/",
    external: true,
    active: false,
  },
];

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
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 50,
          border: "none",
          backgroundColor: "transparent",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundImage: "linear-gradient(to bottom, rgba(242, 251, 255, 0.1) 0%, transparent 100%)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            // FIXED RESPONSIVE BOUNDARIES: Max containment boundary matching max-w-7xl/2xl
            maxWidth: { xs: "100%", md: "1280px", lg: "1440px", xl: "1536px" },
            mx: "auto",
            // FIXED RESPONSIVE PADDING: Fluid margins that scale gracefully up to wide displays
            px: { xs: "1.25rem", sm: "2rem", md: "2.5rem", lg: "4rem" },
            height: "5rem",
            minHeight: "5rem !important",
          }}
        >
          {/* COLUMN 1: Left aligned Lottie wrapper */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              position: "relative",
              height: "100%",
            }}
          >
            <Box
              id="lottie-nav"
              sx={{
                width: { xs: "120px", sm: "140px", md: "150px" }, // Responsive sizing for the logo container
                pointerEvents: "none",
              }}
            >
              <Lottie
                animationData={VeselaLogoBlack}
                loop={false}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          </Box>

          {/* COLUMN 2: Desktop Links */}
          <Stack
            direction="row"
            spacing={0}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              gap: { md: "1.75rem", lg: "2.5rem" }, // Fluid spacing between navigation targets
              fontFamily: "'Manrope', sans-serif",
              letterSpacing: "-0.025em",
              position: "relative",
              zIndex: 10,
            }}
          >
            {menus.map((menu) => (
              <Box
                key={menu.label}
                component={Link}
                href={menu.href}
                target={menu.external ? "_blank" : undefined}
                rel={menu.external ? "noopener noreferrer" : undefined}
                sx={{
                  textDecoration: "none",
                  fontFamily: "'Manrope', sans-serif",
                  letterSpacing: "-0.025em",
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                  transition: "opacity 300ms ease-in-out, color 300ms ease-in-out",
                  ...(menu.active
                    ? {
                      color: "#3e1929",
                      fontWeight: 700,
                      borderBottom: "2px solid #3e1929",
                    }
                    : {
                      color: "#504447",
                      borderBottom: "2px solid transparent",
                      "&:hover": {
                        color: "#3e1929",
                        opacity: 0.8,
                      },
                    }),
                }}
              >
                {menu.label}
              </Box>
            ))}
          </Stack>

          {/* COLUMN 3: Right Action elements */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSignIn}
              type="button"
              sx={{
                fontWeight: '400',
                borderRadius: '40px',
                padding: '10px 25px',
                fontSize: '14px',
                backgroundColor: "#3e1929",
                color: "#FFFFFF",
                boxShadow: "none",
                display: { xs: "none", md: "flex" },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "#250514",
                  opacity: 0.9,
                  boxShadow: "none",
                },
              }}
            >
              Sign In
            </Button>

            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#3e1929",
                p: 1,
              }}
            >
              <MenuIcon sx={{ fontSize: "26px" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 320 },
            border: "none",
            bgcolor: "rgba(242, 251, 255, 0.98)",
            backdropFilter: "blur(20px)",
            p: 4,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 5,
          }}
        >
          <Box sx={{ height: "45px", width: "110px", overflow: "hidden" }}>
            <Lottie animationData={VeselaLogoBlack} loop={false} />
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: "#504447" }}>
            <CloseIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>

        <List sx={{ p: 0, flex: 1 }}>
          {menus.map((menu) => (
            <ListItemButton
              key={menu.label}
              component={Link}
              href={menu.href}
              target={menu.external ? "_blank" : undefined}
              rel={menu.external ? "noopener noreferrer" : undefined}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "0.5rem",
                mb: 1.5,
                py: 1.5,
                px: 2,
                color: menu.active ? "#3e1929" : "#504447",
                backgroundColor: menu.active ? "rgba(62, 25, 41, 0.04)" : "transparent",
              }}
            >
              <ListItemText
                primary={menu.label}
                primaryTypographyProps={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: menu.active ? 700 : 500,
                  fontSize: "16px",
                  letterSpacing: "-0.01em",
                }}
              />
              <ChevronRightIcon sx={{ fontSize: "18px", opacity: 0.4, color: "#3e1929" }} />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ mt: "auto" }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleSignIn();
              setMobileOpen(false);
            }}
            sx={{
              fontWeight: '400',
              borderRadius: '40px',
              padding: '10px 25px',
              fontSize: '14px',
              "&:hover": { backgroundColor: "#250514", boxShadow: "none" },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Drawer>
    </>
  );
}