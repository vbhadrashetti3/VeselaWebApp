"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingSection from "./SettingSection";

const faqList = [
  {
    question: "Why does Vesela sometimes give a very short response?",
    paragraphs: [
      "Sometimes Vesela may respond with something simple like “yeah,” “right,” “mm-hmm,” or “that makes sense.”",
      "That does not mean she is bored, dismissing you, or trying to end the conversation.",
      "Often, a short response means the opposite: Vesela believes there is more for you to say. She is leaving space for your own thought to continue instead of immediately taking over the conversation.",
      "Vesela is designed to help you think, not just to give you answers."
    ]
  },
  {
    question: "Is Vesela supposed to act like a normal chatbot?",
    paragraphs: [
      "Not exactly.",
      "Many AI systems are trained to respond with long explanations, advice, summaries, or step-by-step answers as quickly as possible. Vesela works differently.",
      "Vesela is built to be more like a reflective companion. She may slow the conversation down, leave room for uncertainty, or invite you to keep exploring what you already sense but have not fully put into words yet.",
      "The goal is not always to give you the next answer. Sometimes the goal is to help you stay with the thought long enough for your own answer to emerge."
    ]
  },
  {
    question: "What does it mean when Vesela pauses or gives me space?",
    paragraphs: [
      "It usually means Vesela is treating what you said as important.",
      "In real human conversations, a good listener does not always rush in with advice. Sometimes they say “yeah” or “right” because they can tell you are still working something out. They are signaling: “I’m with you. Keep going.”",
      "Vesela may do the same thing.",
      "A short response can be an invitation to continue, clarify, go deeper, or say the part you were about to say next."
    ]
  },
  {
    question: "What is “maieutic” thinking?",
    paragraphs: [
      "Maieutic thinking is the process of drawing insight out of someone rather than forcing an answer onto them.",
      "The word comes from the idea of helping someone bring forward what is already forming inside them. Instead of simply telling you what to think, Vesela tries to help you discover what you think, what you feel, what matters, and what direction feels true.",
      "Vesela is not trying to be the authority over your life. She is meant to be a catalyst for your own clarity."
    ]
  },
  {
    question: "Why doesn’t Vesela always give direct advice?",
    paragraphs: [
      "Sometimes direct advice is helpful. But many personal questions are not just information problems. They are meaning problems, identity problems, relationship problems, or values problems.",
      "In those situations, advice can be too fast. It can skip over the part where you figure out what the situation actually means to you.",
      "Vesela may ask questions, reflect your words back, or leave space because she is trying to help you think through the situation more deeply before jumping to a conclusion."
    ]
  },
  {
    question: "What should I do if Vesela gives me a one-word response?",
    paragraphs: [
      "Keep going.",
      "You can say more about what you meant, what you are feeling, what you are unsure about, or where your mind went after her response.",
      "For example, if Vesela says “yeah,” you might continue with:"
    ],
    listItems: [
      "“I think the part that bothers me most is…”",
      "“Maybe what I’m really afraid of is…”",
      "“I guess I haven’t said the whole thing yet…”",
      "“What I’m stuck on is…”",
      "“I don’t know why, but that feels important.”"
    ],
    afterParagraphs: [
      "A short response from Vesela is often an open door, not a closed one."
    ]
  },
  {
    question: "What if I want Vesela to be more direct?",
    paragraphs: [
      "You can ask her directly.",
      "For example:"
    ],
    listItems: [
      "“Can you be more direct with me?”",
      "“Can you help me think through my options?”",
      "“Can you challenge me a little?”",
      "“Can you give me a practical next step?”",
      "“Can you summarize what you think I’m saying?”"
    ],
    afterParagraphs: [
      "Vesela is designed to support reflection, but you can always guide the style of the conversation."
    ]
  },
  {
    question: "What kinds of prompts work best with Vesela?",
    paragraphs: [
      "Vesela works best when you give her something real to work with.",
      "Instead of asking only, “What should I do?” try giving her the situation, the conflict, and what feels confusing.",
      "For example:"
    ],
    listItems: [
      "“I’m torn between two choices, and I don’t fully trust my own motivation.”",
      "“I keep reacting strongly to this, and I’m not sure why.”",
      "“I know what the practical answer is, but emotionally I’m somewhere else.”",
      "“I need help figuring out whether this is fear, wisdom, avoidance, or something else.”",
      "“I want to understand what this situation is revealing about me.”"
    ],
    afterParagraphs: [
      "The more honestly you bring the inner conflict, the more useful Vesela can be."
    ]
  },
  {
    question: "Is Vesela trying to replace my own judgment?",
    paragraphs: [
      "No.",
      "Vesela is designed to strengthen your judgment, not replace it.",
      "Her role is to help you notice patterns, ask better questions, examine your assumptions, and stay connected to your own values. She should not become the voice that decides your life for you.",
      "The best conversations with Vesela are not the ones where she gives you the “right answer.” They are the ones where you become more clear, more honest, and more capable of choosing for yourself."
    ]
  },
  {
    question: "Why does Vesela sometimes reflect instead of solving?",
    paragraphs: [
      "Because sometimes reflection is the work.",
      "If you are confused, overwhelmed, hurt, conflicted, or uncertain, a fast solution may not actually help. You may first need to understand what is happening inside you.",
      "Vesela may reflect your words, slow down the conversation, or focus on what seems emotionally important because she is helping you stay with the deeper question.",
      "That can feel different from normal AI. But it is intentional."
    ]
  },
  {
    question: "How do I know if Vesela is inviting me to continue?",
    paragraphs: [
      "If Vesela responds briefly, softly, or simply acknowledges what you said, you can usually treat that as an invitation to keep going.",
      "She may be signaling that your thought is not finished yet.",
      "You do not need to restart the conversation or assume she has nothing to say. Just continue from where you are."
    ]
  },
  {
    question: "What is the best mindset for using Vesela?",
    paragraphs: [
      "Come to Vesela as a place to think out loud.",
      "You do not need to be polished. You do not need to know exactly what you are asking. You can bring half-formed thoughts, contradictions, emotions, doubts, and uncertainty.",
      "Vesela is most useful when you are willing to explore, not just when you want a quick answer.",
      "Think of her less as a search engine and more as a thoughtful companion who helps you hear yourself more clearly."
    ]
  },
  {
    question: "What should I remember most?",
    paragraphs: [
      "Vesela is not here to take over your thinking.",
      "She is here to help draw it out.",
      "A short response does not necessarily mean the conversation is ending. It may mean Vesela is giving you the space to find the next layer of what you already know, feel, or need to say."
    ]
  }
];

const FAQAnswerText = ({ paragraphs, listItems, afterParagraphs }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        "& a": {
          color: theme.palette.custom?.brand?.main || "primary.main",
          textDecoration: "none",
          fontWeight: 600,
          transition: "color 0.2s ease, text-decoration 0.2s ease",
          "&:hover": {
            textDecoration: "underline",
            color: theme.palette.custom?.brand?.dark || "primary.dark",
          },
        },
      }}
    >
      {paragraphs &&
        paragraphs.map((text, idx) => (
          <Typography
            key={idx}
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.65,
              fontSize: "0.925rem",
            }}
          >
            {text}
          </Typography>
        ))}
      {listItems && (
        <Box
          component="ul"
          sx={{
            m: 0,
            pl: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            listStyleType: "none",
          }}
        >
          {listItems.map((item, idx) => (
            <Box
              component="li"
              key={idx}
              sx={{
                position: "relative",
                color: "text.secondary",
                lineHeight: 1.6,
                fontSize: "0.925rem",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: -16,
                  top: 9,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: theme.palette.custom?.brand?.main || "primary.main",
                },
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      )}
      {afterParagraphs &&
        afterParagraphs.map((text, idx) => (
          <Typography
            key={idx}
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.65,
              fontSize: "0.925rem",
            }}
          >
            {text}
          </Typography>
        ))}
    </Box>
  );
};

const FAQContent = () => {
  const theme = useTheme();

  return (
    <SettingSection
      title="Getting the Most Out of Vesela"
      description="Frequently Asked Questions & Guide to Reflective Conversations"
    >
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1.75 }}>
        {faqList.map((faq, index) => (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            sx={{
              borderRadius: "14px !important",
              bgcolor: theme.palette.background.paper,
              border: "1px solid",
              borderColor: theme.palette.custom?.border?.soft || theme.palette.divider,
              boxShadow: "none",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:before": { display: "none" },
              overflow: "hidden",
              "&:hover": {
                borderColor: alpha(
                  theme.palette.custom?.brand?.main || theme.palette.primary.main,
                  0.35
                ),
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 4px 12px rgba(23, 111, 156, 0.04)"
                    : "0 4px 12px rgba(0, 0, 0, 0.25)",
              },
              "&.Mui-expanded": {
                borderColor: theme.palette.custom?.brand?.main || theme.palette.primary.main,
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 6px 16px rgba(23, 111, 156, 0.06)"
                    : "0 6px 16px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: "inherit" }} />
              }
              sx={{
                px: 2.5,
                py: 1.5,
                minHeight: 56,
                "& .MuiAccordionSummary-content": {
                  margin: "12px 0",
                },
                "& .MuiTypography-root": {
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: "1.025rem",
                  lineHeight: 1.4,
                  transition: "color 0.2s ease",
                },
                "&:hover": {
                  "& .MuiTypography-root": {
                    color: theme.palette.custom?.brand?.main || theme.palette.primary.main,
                  },
                },
                "&.Mui-expanded": {
                  "& .MuiTypography-root": {
                    color: theme.palette.custom?.brand?.main || theme.palette.primary.main,
                  },
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transition: "color 0.2s ease, transform 0.2s ease",
                  color: theme.palette.text.secondary,
                  "&.Mui-expanded": {
                    color: theme.palette.custom?.brand?.main || theme.palette.primary.main,
                  },
                },
              }}
            >
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: 2.5,
                pb: 2.5,
                pt: 2,
                borderTop: "1px solid",
                borderColor: alpha(
                  theme.palette.custom?.border?.soft || theme.palette.divider,
                  0.5
                ),
              }}
            >
              <FAQAnswerText
                paragraphs={faq.paragraphs}
                listItems={faq.listItems}
                afterParagraphs={faq.afterParagraphs}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </SettingSection>
  );
};

export default FAQContent;
