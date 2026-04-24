"use client";

import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function PhilosophySection() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#E9EDF0",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 6, md: 10 },
            alignItems: "flex-start",
          }}
        >
          {/* 🔹 LEFT SIDE */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.8rem",
                letterSpacing: "2px",
                color: "#5c5c5c",
                mb: 2,
              }}
            >
              FOUNDATIONAL PHILOSOPHY
            </Typography>

            {/* ✅ FIXED: component="div" to avoid <p><div/></p> */}
            <Typography
              component="div"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#2b0b14",
              }}
            >
              <MotionBox
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                Human
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                Alignment
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                AI
              </MotionBox>
            </Typography>
          </Box>

          {/* 🔹 RIGHT SIDE */}
          <Box>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.3rem", md: "1.8rem" },
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  color: "#3a2a2a",
                }}
              >
                “Think about the best conversation you've ever had with a close
                friend. That spark you feel when ideas are flowing... We don't
                need smarter monologues. We need better mirrors.”
              </Typography>
            </MotionBox>

            {/* Divider Animation */}
            <MotionBox
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 60 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              sx={{
                height: 2,
                bgcolor: "#2b0b14",
                my: 3,
              }}
            />

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "#4a4a4a",
                }}
              >
                Our architecture isn't built to dominate information; it's built
                to synchronize with the human experience. We leverage maeutics
                in our models to reflect the nuance of human emotion, intuition,
                and truth.
              </Typography>
            </MotionBox>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
