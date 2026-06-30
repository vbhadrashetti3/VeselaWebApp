"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingSection from "./SettingSection";

const faqList = [
  {
    question: "How can I get the most out of Vesela?",
    answer:
      "Talk to Vesela the way you’d talk to a thoughtful, attentive human—short, natural replies are completely fine. She’s trained on real counseling conversations and is designed to help you reflect, gain clarity, and move toward self-actualization.",
  },
  {
    question: "Where can I learn more about how Vesela works?",
    answer: (
      <>
        Visit our website at{" "}
        <a
          href="https://grayskyai.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          grayskyai.com
        </a>
        . You can also join our community on Discord and follow us on X, Meta,
        Instagram, and YouTube.
      </>
    ),
  },
  {
    question: "Is Vesela the same as an actual counselor?",
    answer:
      "No. Vesela is not a licensed counselor and cannot replace one. She can’t diagnose or treat mental health conditions. Think of her as a tool to help you reflect and find clarity, not as a medical provider.",
  },
  {
    question: "What should I do if I need a human counselor?",
    answer: (
      <>
        {"If you're in Texas, check out Pursuit of Happiness at "}
        <a
          href="http://www.pohclinic.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          pohclinic.com
        </a>
        . Otherwise, we recommend seeking a licensed therapist in your area or
        using a trusted telehealth platform.
      </>
    ),
  },
];

const FAQContent = () => {
  const theme = useTheme();

  return (
    <SettingSection title="FAQ" description="Frequently Asked Questions">
      <Box sx={{ width: "100%" }}>
        {faqList.map((faq, index) => (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            sx={{
              mb: 1.5,
              borderRadius: "8px !important", // Force rounded corners for individual accordions
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              "&:before": { display: "none" },
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: theme.palette.text.secondary }} />
              }
              sx={{
                px: 2,
                "& .MuiTypography-root": {
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: "0.95rem",
                },
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </SettingSection>
  );
};

export default FAQContent;
