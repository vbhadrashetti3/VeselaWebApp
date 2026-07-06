"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useModal } from "@/context/ModalContext";
import { MODALS } from "@/components/modals/modalConstants";

const MotionBox = motion(Box);

export default function Newsletter() {
  const { openModal } = useModal();

  return (
    <Box
      component="section"
      sx={{
        // bg-surface → #f2fbff
        bgcolor: "#f2fbff",
        py: { xs: 12, md: 20 },
        px: { xs: 2, md: 4 },
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
              fontSize: { xs: "2.8rem", md: "4.5rem", lg: "5.5rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#250514",      // text-primary
              mb: 5,
            }}
          >
            Step into the reflection.
          </Typography>

          <Button
            variant="contained"
            onClick={() => openModal(MODALS.LOGIN, { source: "public" })}
            sx={{
              // bg-gradient-to-br from-primary to-primary-container
              background: "linear-gradient(135deg, #250514 0%, #3e1929 100%)",
              color: "#ffffff",
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 700,
              textTransform: "none",
              letterSpacing: "-0.01em",
              px: { xs: 6, md: 8 },
              py: { xs: 2, md: 2.5 },
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(37,5,20,0.25)",
              transition: "all 0.3s ease",
              "&:hover": {
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: "0 12px 30px rgba(37,5,20,0.30)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            Start a Conversation
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
}
