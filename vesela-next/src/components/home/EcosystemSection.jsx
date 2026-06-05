"use client";

import { Box, Typography, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
    featured: false,
  },
  {
    title: "Graysky AI",
    desc: "Creating AI that is unconcerned with advancing coding benchmarks, we instead advance humanity.",
    link: "grayskyai.com",
    icon: <ScienceIcon />,
    featured: true,
  },
  {
    title: "Alignment AI",
    desc: "The core protocol for ensuring large language models prioritize human safety and ethical flourishing.",
    link: "humanalignmentai.com",
    icon: <SyncAltIcon />,
    featured: false,
  },
];

export default function EcosystemSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.default",
        transition: "background-color 0.3s ease",
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
              color: "text.primary",
            }}
          >
            The Ecosystem
          </Typography>

          <Typography
            sx={{
              fontSize: "0.8rem",
              letterSpacing: "2px",
              color: "text.secondary",
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
          {cards.map((card, i) => {
            const isFeatured = card.featured;
            const cardBg = isFeatured
              ? theme.palette.primary.main
              : theme.palette.background.paper;
            const cardColor = isFeatured
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary;

            return (
              <MotionBox
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                sx={{
                  bgcolor: cardBg,
                  color: cardColor,
                  borderRadius: 1.5,
                  p: 4,
                  minHeight: 360,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: isFeatured ? "none" : `1px solid ${theme.palette.custom.border.soft}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: theme.palette.mode === "dark" 
                      ? "0 10px 30px rgba(0,0,0,0.5)" 
                      : "0 10px 30px rgba(0,0,0,0.1)",
                    borderColor: isFeatured ? "transparent" : theme.palette.primary.main,
                  },
                }}
              >
                {/* 🔹 Top */}
                <Box>
                  <Box sx={{ mb: 2, color: isFeatured ? "inherit" : theme.palette.primary.main }}>
                    {card.icon}
                  </Box>

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
                      opacity: isFeatured ? 0.9 : 0.8,
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
                    opacity: 0.9,
                  }}
                >
                  {card.link}
                </Typography>
              </MotionBox>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
