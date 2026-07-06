"use client";

import { Box, Typography, Container } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GroupsIcon from "@mui/icons-material/Groups";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const cards = [
  {
    title: "Humanity Bench",
    desc: "Redefining what it means to measure AI and human relations through alignment with humanity.",
    link: "humanitybench.org",
    href: "https://humanitybench.org/",
    icon: <GroupsIcon sx={{ fontSize: 40, color: "#3e1929" }} />,
    featured: false,
    // bg-surface-container-lowest → white
    bg: "#ffffff",
    textColor: "#250514",          // text-primary
    descColor: "#504447",          // text-on-surface-variant
    linkColor: "#250514",
    borderColor: "#250514",
  },
  {
    title: "Graysky AI",
    desc: "Creating AI that is unconcerned with advancing coding benchmarks, we instead advance humanity.",
    link: "grayskyai.com",
    href: "https://grayskyai.com/",
    icon: <CloudSyncIcon sx={{ fontSize: 40, color: "#b7c9d4" }} />,
    featured: true,
    // bg-primary-container → #3e1929
    bg: "#3e1929",
    textColor: "#ffffff",
    descColor: "#b27e91",          // text-on-primary-container
    linkColor: "#ffffff",
    borderColor: "#ffffff",
  },
  {
    title: "Alignment AI",
    desc: "The core protocol for ensuring large language models prioritize human safety and ethical flourishing.",
    link: "humanalignmentai.com",
    href: "https://humanalignmentai.com/",
    icon: <PsychologyIcon sx={{ fontSize: 40, color: "#250514" }} />,
    featured: false,
    // bg-surface-container-highest → #d6e5ec
    bg: "#d6e5ec",
    textColor: "#250514",
    descColor: "#504447",
    linkColor: "#250514",
    borderColor: "#250514",
  },
];

export default function EcosystemSection() {
  return (
    <Box
      component="section"
      sx={{
        // bg-surface-container-low → #e7f6fd
        bgcolor: "#e7f6fd",
        py: { xs: 10, md: 16 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 8,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#250514",       // text-primary
            }}
          >
            The Ecosystem
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#504447",       // text-on-surface-variant
            }}
          >
            Active Projects 2026
          </Typography>
        </Box>

        {/* Cards grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 4, md: 4 },
          }}
        >
          {cards.map((card, i) => (
            <MotionBox
              key={card.title}
              component="a"
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              sx={{
                bgcolor: card.bg,
                borderRadius: "12px",
                p: { xs: 4, md: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "450px",
                textDecoration: "none",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  "& .open-in-new": {
                    opacity: 1,
                  },
                },
              }}
            >
              {/* Top row: icon + open-in-new */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 6,
                }}
              >
                {card.icon}
                <OpenInNewIcon
                  className="open-in-new"
                  sx={{
                    fontSize: 22,
                    color: card.textColor,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "var(--font-manrope), Manrope, sans-serif",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: card.textColor,
                    mb: 2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: card.descColor,
                    lineHeight: 1.65,
                  }}
                >
                  {card.desc}
                </Typography>
              </Box>

              {/* Bottom link */}
              <Typography
                component="span"
                sx={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  display: "inline-block",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: card.linkColor,
                  borderBottom: `2px solid ${card.borderColor}`,
                  width: "fit-content",
                  pb: 0.25,
                  mt: 4,
                }}
              >
                {card.link}
              </Typography>
            </MotionBox>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
