"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { List, ChevronDown } from "lucide-react";

/**
 * Extracts headings from raw HTML content and injects IDs if missing.
 * @param {string} htmlContent 
 * @returns {{ headings: Array<{ id: string, text: string, level: number }>, processedHtml: string }}
 */
export function extractHeadings(htmlContent) {
  if (!htmlContent || typeof window === "undefined") {
    return { headings: [], processedHtml: htmlContent || "" };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const headingElements = doc.querySelectorAll("h1, h2, h3");

  const headings = [];

  headingElements.forEach((el, index) => {
    let id = el.id;
    if (!id) {
      id = el.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!id) id = `heading-${index}`;
      el.id = id;
    }

    const level = parseInt(el.tagName.replace("H", ""), 10);
    headings.push({
      id,
      text: el.textContent.trim(),
      level,
    });
  });

  return {
    headings,
    processedHtml: doc.body.innerHTML,
  };
}

export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const handleScroll = () => {
      const headingNodes = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingNodes.length - 1; i >= 0; i--) {
        const node = headingNodes[i];
        if (node.offsetTop <= scrollPosition) {
          setActiveId(node.id);
          return;
        }
      }
      if (headingNodes.length > 0) {
        setActiveId(headingNodes[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  return (
    <>
      {/* Desktop Sticky Table of Contents Sidebar */}
      <Box
        className="toc-desktop"
        sx={{
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 100,
          p: 3,
          borderRadius: 3,
          background: "var(--card)",
          border: "1px solid var(--line)",
          maxHeight: "calc(100vh - 140px)",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <List size={16} /> On This Page
        </Typography>

        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <Box
                component="li"
                key={h.id}
                sx={{
                  mb: 1,
                  pl: (h.level - 1) * 1.5,
                }}
              >
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(h.id);
                  }}
                  style={{
                    display: "block",
                    fontSize: h.level === 1 ? "0.9rem" : "0.85rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--accent)" : "var(--muted)",
                    lineHeight: 1.4,
                    transition: "color 0.2s ease",
                    textDecoration: "none",
                  }}
                >
                  {h.text}
                </a>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Mobile Collapsible Accordion Table of Contents */}
      <Box
        className="toc-mobile"
        sx={{
          display: { xs: "block", md: "none" },
          mb: 4,
        }}
      >
        <Accordion
          sx={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: "12px !important",
            boxShadow: "none",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ChevronDown size={18} sx={{ color: "var(--muted)" }} />}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "var(--ink)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <List size={16} /> Table of Contents ({headings.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {headings.map((h) => (
                <Box
                  component="li"
                  key={h.id}
                  sx={{
                    py: 0.75,
                    pl: (h.level - 1) * 1.5,
                    borderBottom: "1px solid var(--line)",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(h.id);
                    }}
                    style={{
                      fontSize: "0.875rem",
                      color: activeId === h.id ? "var(--accent)" : "var(--ink)",
                      fontWeight: activeId === h.id ? 600 : 400,
                    }}
                  >
                    {h.text}
                  </a>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
}
