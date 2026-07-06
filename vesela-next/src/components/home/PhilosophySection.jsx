"use client";

import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function PhilosophySection() {
  return (
    <Box
      component="section"
      sx={{
        // bg-surface → #f2fbff
        bgcolor: "#f2fbff",
        py: { xs: 10, md: 16 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "5fr 7fr" },
            gap: { xs: 6, md: 10 },
            alignItems: "flex-end",
          }}
        >
          {/* ── LEFT: label + heading ── */}
          <Box>
            <Typography
              sx={{
                fontFamily: "var(--font-manrope), Manrope, sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#3e1929",      // text-primary
                mb: 3,
              }}
            >
              Foundational Philosophy
            </Typography>

            <Typography
              component="div"
              sx={{
                fontFamily: "var(--font-manrope), Manrope, sans-serif",
                fontSize: { xs: "3rem", md: "4.5rem", lg: "5rem" },
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "#3e1929",      // text-primary
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
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                Alignment
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                AI
              </MotionBox>
            </Typography>
          </Box>

          {/* ── RIGHT: quote + divider + body ── */}
          <Box sx={{ maxWidth: "640px" }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: { xs: "1.4rem", md: "1.75rem", lg: "2rem" },
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.5,
                  color: "#504447",    // text-on-surface-variant
                  mb: 6,
                }}
              >
                &ldquo;Think about the best conversation you&rsquo;ve ever had
                with a close friend. That spark you feel when ideas are
                flowing&hellip; We don&rsquo;t need smarter monologues. We need
                better mirrors.&rdquo;
              </Typography>
            </MotionBox>

            {/* Divider */}
            <MotionBox
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 96 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{
                height: "1px",
                bgcolor: "#3e1929",   // bg-primary
                mb: 6,
              }}
            />

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: "#504447",   // text-on-surface-variant
                }}
              >
                Our architecture isn&rsquo;t built to dominate information;
                it&rsquo;s built to synchronize with the human experience. We
                leverage maeutics in our models to reflect the nuance of human
                emotion, intuition, and truth.
              </Typography>
            </MotionBox>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
