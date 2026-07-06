"use client";

import { Box, Typography, Link, Stack } from "@mui/material";

export default function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "rgba(62, 25, 41, 0.08)", // Softer custom divider color matching your palette
        py: { xs: 5, sm: 4 },
        px: { xs: "1.25rem", sm: "2rem", md: "2.5rem", lg: "4rem" }, // Exact padding footprint matching your header
        mt: "auto", // Ensures footer sticks to bottom if page content is short
        backgroundColor: "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", sm: "row" }, // Clean stack swap for mobile devices
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 3, sm: 2 },
          // FIXED RESPONSIVE BOUNDARIES: Matches header containment parameters perfectly
          maxWidth: { xs: "100%", md: "1280px", lg: "1440px", xl: "1536px" },
          mx: "auto",
          width: "100%",
        }}
      >
        {/* Copyright Layout Block */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "#504447",
            opacity: 0.8,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          © 2026 Vesela. All rights reserved.
        </Typography>

        {/* Links Navigation Row Block */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={0}
          justifyContent="center"
          alignItems="center"
          gap={{ xs: "1.25rem", sm: "2rem" }} // Responsive fluid gap distribution
          flexWrap="wrap"
          useFlexGap
          sx={{
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {[
            { label: "Humanity Bench", href: "https://humanitybench.org/", external: true },
            { label: "Graysky AI", href: "https://grayskyai.com/", external: true },
            { label: "Human Alignment AI", href: "https://humanalignmentai.com/", external: true },
            { label: "Privacy", href: "#", external: false },
            { label: "Terms", href: "#", external: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              underline="none"
              sx={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#504447",
                whiteSpace: "nowrap",
                transition: "all 250ms ease-in-out",
                "&:hover": {
                  color: "#3e1929",
                  opacity: 0.9
                },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}