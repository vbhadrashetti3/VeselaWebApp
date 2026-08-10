"use client";

import Box from "@mui/material/Box";
import BlogCard from "./BlogCard";

export default function BlogGrid({ posts = [] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <Box
      className="blog-grid"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: { xs: 3, sm: 3.5, md: 4 },
        my: 4,
      }}
    >
      {posts.map((post) => (
        <BlogCard key={post.id || post.slug} post={post} />
      ))}
    </Box>
  );
}
