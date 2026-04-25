"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Newsletter() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#E9EDF0",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", md: "2.5rem" },
              fontWeight: 700,
              color: "#2b0b14",
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
