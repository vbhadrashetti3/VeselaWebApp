"use client";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function Newsletter() {
  return (
    <Box component="section" sx={{ py: 30, px: 3, bgcolor: "white" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            bgcolor: "primary.main",
            borderRadius: 12,
            p: { xs: 8, md: 16 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 50px 100px rgba(37, 5, 20, 0.25)",
          }}
        >
          {/* Background Image Effect */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.3,
              background:
                "radial-gradient(circle, #3e1929 0%, transparent 70%)",
            }}
          />

          <Box
            sx={{ position: "relative", zIndex: 1, maxWidth: 800, mx: "auto" }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 800,
                mb: 4,
                letterSpacing: "-0.04em",
                fontSize: { xs: "3rem", md: "4.5rem" },
              }}
            >
              Stay updated on our progress.
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "1.25rem",
                mb: 8,
                fontWeight: 300,
              }}
            >
              Join our quarterly mailing list for insights into the frontier of
              AI research.
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              <TextField
                placeholder="Email Address"
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 4,
                    color: "white",
                    p: 1,
                    px: 2,
                    border: "1px solid rgba(255,255,255,0.1)",
                  },
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.3)",
                    opacity: 1,
                  },
                }}
              />
              <Button
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  px: 6,
                  py: 2,
                  borderRadius: 4,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                SUBSCRIBE
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
