"use client";
import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import Link from "next/link";

export default function PublicNavbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "rgba(242, 251, 255, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 8 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            letterSpacing: "-0.05em",
          }}
        >
          Vesela AI
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Button
            color="inherit"
            component={Link}
            href="/chat"
            sx={{ fontWeight: 600 }}
          >
            Try Chat
          </Button>
          <Button
            variant="contained"
            component={Link}
            href="/login"
            sx={{ borderRadius: "50px", px: 4 }}
          >
            Sign In
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
