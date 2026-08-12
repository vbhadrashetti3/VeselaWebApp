"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function BlogCard({ post }) {
  if (!post) return null;

  const {
    slug,
    title,
    summary,
    featuredImage,
    publishDate,
    category,
  } = post;

  const formattedDate = publishDate
    ? format(new Date(publishDate), "MMM d, yyyy")
    : "";

  return (
    <Box
      className="blog-card"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        background: "var(--card)",
        border: "1px solid var(--line)",
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: "var(--line-strong)",
        },
      }}
    >
      {featuredImage && (
        <Link
          href={`/blog/${slug}`}
          style={{
            display: "block",
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            overflow: "hidden",
            background: "var(--surface)",
          }}
        >
          <img
            src={featuredImage}
            alt={title}
            loading="lazy"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Link>
      )}

      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flex: 1 }}>
        {category && (
          <Typography
            variant="caption"
            sx={{
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 1,
              display: "block",
            }}
          >
            {category}
          </Typography>
        )}

        <Link href={`/blog/${slug}`}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.35,
              mb: 1.25,
              color: "var(--ink)",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "var(--accent)",
              },
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
        </Link>

        <Typography
          variant="body2"
          sx={{
            color: "var(--muted)",
            lineHeight: 1.5,
            mb: 2.5,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {summary}
        </Typography>

        <Box
          sx={{
            pt: 2,
            borderTop: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" sx={{ color: "var(--muted)", fontSize: "0.8rem" }}>
            {formattedDate}
          </Typography>

          <Link
            href={`/blog/${slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            Read <ArrowRight size={14} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
