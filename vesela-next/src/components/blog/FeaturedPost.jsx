"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  const {
    slug,
    title,
    summary,
    featuredImage,
    authorName,
    authorAvatar,
    publishDate,
    category,
    readTimeMinutes,
  } = post;

  const formattedDate = publishDate
    ? format(new Date(publishDate), "MMMM d, yyyy")
    : "";

  return (
    <Box
      className="featured-post-card"
      sx={{
        mb: 6,
        borderRadius: 4,
        overflow: "hidden",
        background: "var(--card)",
        border: "1px solid var(--line)",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
        gap: { xs: 0, md: 4 },
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          borderColor: "var(--line-strong)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
          "& .featured-image": {
            transform: "scale(1.03)",
          },
        },
      }}
    >
      <Link href={`/blog/${slug}`} style={{ position: "relative", minHeight: 320, overflow: "hidden", display: "block" }}>
        <img
          src={featuredImage}
          alt={title}
          className="featured-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
        />
        {category && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              background: "var(--ink)",
              color: "var(--inverse-ink)",
              fontSize: "0.8rem",
              fontWeight: 700,
              px: 2,
              py: 0.75,
              borderRadius: "9999px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Featured • {category}
          </Box>
        )}
      </Link>

      <Box
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Link href={`/blog/${slug}`}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.875rem", md: "2.125rem" },
              lineHeight: 1.25,
              mb: 2,
              color: "var(--ink)",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "var(--accent)",
              },
            }}
          >
            {title}
          </Typography>
        </Link>

        <Typography
          variant="body1"
          sx={{
            color: "var(--muted)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            mb: 3,
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            pt: 3,
            borderTop: "1px solid var(--line)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={authorAvatar}
              alt={authorName}
              sx={{ width: 44, height: 44 }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)", lineHeight: 1.2 }}>
                {authorName}
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--muted)", fontSize: "0.825rem", display: "flex", alignItems: "center", gap: 0.75 }}>
                <span>{formattedDate}</span>
                {readTimeMinutes && (
                  <>
                    <span>•</span>
                    <Clock size={14} />
                    <span>{readTimeMinutes} min read</span>
                  </>
                )}
              </Typography>
            </Box>
          </Box>

          <Button
            component={Link}
            href={`/blog/${slug}`}
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            sx={{
              borderRadius: "9999px",
              px: 3,
              py: 1,
              background: "var(--ink)",
              color: "var(--inverse-ink)",
              "&:hover": {
                background: "var(--accent)",
                color: "#ffffff",
              },
            }}
          >
            Read Article
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
