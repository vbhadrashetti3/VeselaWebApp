"use client";

import { useMemo } from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import RelatedArticles from "@/components/blog/RelatedArticles";

export default function BlogDetailClient({ post, relatedPosts = [] }) {
  if (!post) return null;

  const {
    slug,
    title,
    summary,
    htmlContent,
    featuredImage,
    authorName,
    publishDate,
    category,
    tags = [],
  } = post;

  const formattedDate = publishDate
    ? format(new Date(publishDate), "MMMM d, yyyy")
    : "";

  // Sanitize HTML safely
  const cleanHtml = useMemo(() => {
    return typeof window !== "undefined"
      ? DOMPurify.sanitize(htmlContent, {
          ADD_TAGS: ["iframe"],
          ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
        })
      : htmlContent;
  }, [htmlContent]);

  return (
    <main className="blog-detail-page" style={{ paddingTop: "90px", paddingBottom: "80px", minHeight: "80vh" }}>
      <Container maxWidth="md">
        {/* Back to Blog Link */}
        <Box sx={{ mb: 3 }}>
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "var(--muted)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </Box>

        {/* Category */}
        {category && (
          <Typography
            variant="caption"
            sx={{
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 1.5,
              display: "block",
            }}
          >
            {category}
          </Typography>
        )}

        {/* Blog Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.85rem", sm: "2.5rem", md: "2.75rem" },
            lineHeight: 1.25,
            color: "var(--ink)",
            mb: 2,
          }}
        >
          {title}
        </Typography>

        {/* Published Date / Author */}
        <Typography
          variant="body2"
          sx={{
            color: "var(--muted)",
            fontSize: "0.9rem",
            mb: 4,
          }}
        >
          {authorName ? `${authorName} · ` : ""}{formattedDate}
        </Typography>

        {/* Featured Image */}
        {featuredImage && (
          <Box
            sx={{
              width: "100%",
              maxHeight: 460,
              borderRadius: 2,
              overflow: "hidden",
              mb: 5,
              background: "var(--surface)",
            }}
          >
            <img
              src={featuredImage}
              alt={title}
              style={{
                width: "100%",
                maxHeight: 460,
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        )}

        {/* Article Content - Clean & High Readability */}
        <Box
          className="article-html-content"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
          sx={{
            fontSize: { xs: "1.05rem", sm: "1.125rem" },
            lineHeight: 1.75,
            color: "var(--ink)",
            maxWidth: "760px",
            mx: "auto",
            "& p": { mb: 3 },
            "& h1, & h2, & h3, & h4": {
              fontWeight: 700,
              color: "var(--ink)",
              mt: 4,
              mb: 2,
              lineHeight: 1.3,
            },
            "& h1": { fontSize: { xs: "1.65rem", sm: "2rem" } },
            "& h2": { fontSize: { xs: "1.4rem", sm: "1.75rem" } },
            "& h3": { fontSize: { xs: "1.2rem", sm: "1.4rem" } },
            "& blockquote": {
              my: 3,
              py: 1.5,
              px: 3,
              borderLeft: "3px solid var(--accent)",
              background: "var(--surface)",
              borderRadius: "0 8px 8px 0",
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: "var(--ink)",
            },
            "& ul, & ol": { mb: 3, pl: 3.5 },
            "& li": { mb: 1 },
            "& pre": {
              background: "#121315",
              color: "#f8f7f3",
              p: 2.5,
              borderRadius: 2,
              overflowX: "auto",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.875rem",
              my: 3,
            },
            "& code": {
              background: "var(--surface)",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: "0.875em",
              fontFamily: "var(--font-mono), monospace",
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 2,
              my: 3,
            },
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              my: 3,
              border: "1px solid var(--line)",
            },
            "& th, & td": {
              p: 1.25,
              border: "1px solid var(--line)",
              textAlign: "left",
            },
            "& th": {
              background: "var(--surface)",
              fontWeight: 600,
            },
          }}
        />

        {/* Tags */}
        {tags && tags.length > 0 && (
          <Box sx={{ mt: 5, pt: 3, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "var(--muted)", mr: 1 }}>
              Tags:
            </Typography>
            {tags.map((t) => (
              <Chip
                key={t}
                label={t}
                component={Link}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                clickable
                size="small"
                sx={{
                  borderRadius: "9999px",
                  background: "var(--surface)",
                  color: "var(--ink)",
                  border: "1px solid var(--line)",
                  fontSize: "0.8rem",
                }}
              />
            ))}
          </Box>
        )}

        {/* Related Articles */}
        <RelatedArticles posts={relatedPosts} />
      </Container>
    </main>
  );
}
