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

const faqList = [
  {
    question: "How can I get the most out of Grace?",
    answer:
      "Talk to Grace the way you’d talk to a thoughtful, attentive human—short, natural replies are completely fine. She’s trained on real counseling conversations and is designed to help you reflect, gain clarity, and move toward self-actualization.",
  },
  {
    question: "Where can I learn more about how Grace works?",
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
    question: "Is Grace the same as an actual counselor?",
    answer:
      "No. Grace is not a licensed counselor and cannot replace one. She can’t diagnose or treat mental health conditions. Think of her as a tool to help you reflect and find clarity, not as a medical provider.",
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
  {
    question: "How much does Grace cost?",
    answer: (
      <>
        Grace costs $18.99/month on our website{" "}
        <a
          href="https://grayskyai.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          grayskyai.com
        </a>{" "}
        or $19.99/month through the app stores. Every new user gets a 7-day free
        trial.
      </>
    ),
  },
  {
    question: "What do I get with a paid subscription?",
    answer:
      "You unlock our most advanced Grace model, trained on proprietary counseling data, psychology research, and a custom cognitive architecture built for depth and guidance.",
  },
  {
    question: "Is Grace right for me?",
    answer:
      "Grace is great if you think deeply, feel stuck or overwhelmed, want clarity, need support between therapy sessions, or prefer deeper, reflective conversations. Try the 7-day trial to see if she fits your style.",
  },
  {
    question: "Can Grace diagnose me?",
    answer:
      "No. Grace cannot diagnose, treat, or cure mental health conditions. She helps you reflect and recognize patterns—not make medical decisions.",
  },
  {
    question: "What if I need counseling but can’t afford this?",
    answer: (
      <>
        Reach out to us using the contact form at{" "}
        <a
          href="https://grayskyai.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          grayskyai.com/contact
        </a>
        . We try to help when someone’s situation is genuinely difficult.
      </>
    ),
  },
  {
    question: "What features are planned for the future?",
    answer: (
      <>
        We’re working on a 5× larger dataset, physics-inspired psychological
        modeling, and richer avatar-based interfaces. Updates are posted first
        in our Discord community:{" "}
        <a
          href="https://grayskyai.com/community"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          grayskyai.com/community
        </a>
        .
      </>
    ),
  },
  {
    question: "Why not just use ChatGPT or Claude for counseling?",
    answer:
      "Generic models explain and advise; Grace guides you toward your own insights. She's trained on proprietary counseling datasets, uses a custom cognitive architecture, and is overseen by licensed clinicians.",
  },
  {
    question: "How is Grace different from other AI counselor apps?",
    answer:
      "Most apps wrap generic models. Grace uses proprietary counseling datasets, a custom self-actualization architecture, and clinician oversight—built from the ground up.",
  },
  {
    question: "Is there a free version?",
    answer:
      "Not permanently, but every new user gets a 7-day free trial. We don’t run ads or sell your data.",
  },
  {
    question: "Are my conversations confidential?",
    answer: (
      <>
        Yes. Conversations are encrypted and confidential. Details are in our
        Privacy Policy:{" "}
        <a
          href="https://grayskyai.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          grayskyai.com/privacy
        </a>
        .
      </>
    ),
  },
  {
    question: "What’s the purpose of the pre-session questions?",
    answer:
      "They help Grace understand your emotional state and what you want to work on. Some technical questions also support future model improvements.",
  },
  {
    question: "What happens after the 7-day free trial?",
    answer: (
      <>
        Your account auto-renews unless you cancel. Full pricing details are at{" "}
        <a
          href="https://grayskyai.com/pricing"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          grayskyai.com/pricing
        </a>
        .
      </>
    ),
  },
  {
    question: "What if I’m in crisis or feel unsafe?",
    answer: (
      <>
        {"Grace is not a crisis service. If you're in danger or experiencing self-harm thoughts, contact your local emergency number. In the U.S., you can call or text 988 or visit "}
        <a
          href="https://988lifeline.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          988lifeline.org
        </a>
        .
      </>
    ),
  },
];

const FAQContent = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 3 },
        height: "100%",
        overflowY: "auto",
      }}
    >
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
  );
};

export default FAQContent;
