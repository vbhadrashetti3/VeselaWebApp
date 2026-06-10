"use client";
import { Box, Typography, Link, Stack } from "@mui/material";
import Image from "next/image";

export default function PublicFooter() {
  return (
    <Box

      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: 3,
        px: 2,
        mt: 5,
      }}
    >
      {/* Top Row */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Left: Logo */}

        {/* Center: Menu */}
        <Stack
          direction="row"
          spacing={4}
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Link href="https://humanitybench.org/" target="_blank" rel="noopener noreferrer" underline="none" color="text.secondary">
            Humanity Bench
          </Link>
          <Link href="https://grayskyai.com/" target="_blank" rel="noopener noreferrer" underline="none" color="text.secondary">
            Graysky AI
          </Link>
          <Link href="https://humanalignmentai.com/" target="_blank" rel="noopener noreferrer" underline="none" color="text.secondary">
            Human Alignment AI
          </Link>
          <Link href="#" underline="none" color="text.secondary">
            Privacy
          </Link>
          <Link href="#" underline="none" color="text.secondary">
            Terms
          </Link>
        </Stack>
      </Box>

      {/* Bottom Copyright */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © 2026
        </Typography>
      </Box>
    </Box>
  );
}
