"use client";
import { Box, Typography, Link, Stack } from "@mui/material";

export default function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: 3,
        px: { xs: 2, sm: 4 },
        mt: 5,
        textAlign: "center",
      }}
    >
      {/* Links row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 3 }}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
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

      {/* Copyright */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        © 2026
      </Typography>
    </Box>
  );
}
