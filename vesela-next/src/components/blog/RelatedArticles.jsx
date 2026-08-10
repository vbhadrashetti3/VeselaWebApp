"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BlogCard from "./BlogCard";

export default function RelatedArticles({ posts = [] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <Box
      className="related-articles-section"
      sx={{
        mt: 8,
        pt: 5,
        borderTop: "1px solid var(--line)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          mb: 3,
          color: "var(--ink)",
        }}
      >
        Related Articles
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {posts.map((post) => (
          <BlogCard key={post.id || post.slug} post={post} />
        ))}
      </Box>
    </Box>
  );
}
