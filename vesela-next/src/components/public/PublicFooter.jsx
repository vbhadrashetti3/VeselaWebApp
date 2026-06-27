"use client";
import { Box, Typography, Link, Stack } from "@mui/material";
import { CHAT_CONTAINER_MAX_WIDTH } from "@/constant";

export default function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: { xs: 4, sm: 3 },
        px: { xs: 2, sm: 4 },
        mt: 5,
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: "center",
          gap: { xs: 2.5, sm: 3 },
          maxWidth: CHAT_CONTAINER_MAX_WIDTH,
          mx: "auto",
          width: "100%",
        }}
      >
        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            order: { xs: 2, sm: 1 },
            fontSize: "14px",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          © 2026 Vesela. All rights reserved.
        </Typography>

        {/* Links row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 3 }}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{
            order: { xs: 1, sm: 2 },
          }}
        >
          <Link
            href="https://humanitybench.org/"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="text.secondary"
            sx={{
              fontSize: "14px",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
          >
            Humanity Bench
          </Link>
          <Link
            href="https://grayskyai.com/"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="text.secondary"
            sx={{
              fontSize: "14px",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
          >
            Graysky AI
          </Link>
          <Link
            href="https://humanalignmentai.com/"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="text.secondary"
            sx={{
              fontSize: "14px",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
          >
            Human Alignment AI
          </Link>
          <Link
            href="#"
            underline="none"
            color="text.secondary"
            sx={{
              fontSize: "14px",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
          >
            Privacy
          </Link>
          <Link
            href="#"
            underline="none"
            color="text.secondary"
            sx={{
              fontSize: "14px",
              transition: "color 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
          >
            Terms
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
