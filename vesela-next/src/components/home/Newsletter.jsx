"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Newsletter() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        bgcolor: theme.palette.custom.surface.sidebar,
        py: { xs: 8, md: 12 },
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", md: "2.5rem" },
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Step into the reflection.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 4, borderRadius: 3, px: 4, py: 1.5 }}
          >
            Start a Conversation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
