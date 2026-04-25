"use client";

import { Box, Typography, Container } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ScienceIcon from "@mui/icons-material/Science";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const cards = [
  {
    title: "Humanity Bench",
    desc: "Redefining what it means to measure AI and human relations through alignment with humanity.",
    link: "humanitybench.org",
    icon: <GroupsIcon />,
    bg: "#fff",
    color: "#2b0b14",
  },
  {
    title: "Graysky AI",
    desc: "Creating AI that is unconcerned with advancing coding benchmarks, we instead advance humanity.",
    link: "grayskyai.com",
    icon: <ScienceIcon />,
    bg: "#3a0d18",
    color: "#fff",
  },
  {
    title: "Alignment AI",
    desc: "The core protocol for ensuring large language models prioritize human safety and ethical flourishing.",
    link: "humanalignmentai.com",
    icon: <SyncAltIcon />,
    bg: "#fff",
    color: "#2b0b14",
  },
];

export default function EcosystemSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: "#fff",
      }}
    >
      <Container maxWidth="lg">
        {/* 🔹 Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              fontWeight: 700,
              color: "#2b0b14",
            }}
          >
            The Ecosystem
          </Typography>

          <Typography
            sx={{
              fontSize: "0.8rem",
              letterSpacing: "2px",
              color: "#5c5c5c",
            }}
          >
            ACTIVE PROJECTS 2026
          </Typography>
        </Box>

        {/* 🔹 Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
          }}
        >
          {cards.map((card, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              sx={{
                bgcolor: card.bg,
                color: card.color,
                borderRadius: 1.5,
                p: 4,
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
                cursor: "pointer",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                },
              }}
            >
              {/* 🔹 Top */}
              <Box>
                <Box sx={{ mb: 2 }}>{card.icon}</Box>

                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    opacity: 0.8,
                    lineHeight: 1.6,
                  }}
                >
                  {card.desc}
                </Typography>
              </Box>

              {/* 🔹 Bottom link */}
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                  mt: 3,
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
