"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function BlogFilters({ categories = ["All"], activeCategory = "All", onSelectCategory }) {
  if (!categories || categories.length <= 1) return null;

  return (
    <Box
      className="blog-filters"
      role="tablist"
      aria-label="Blog Category Filters"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        py: 1,
      }}
    >
      {categories.map((cat) => {
        const isActive = (activeCategory || "All").toLowerCase() === cat.toLowerCase();
        return (
          <Button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(cat)}
            sx={{
              borderRadius: "9999px",
              px: 2.5,
              py: 0.75,
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "capitalize",
              color: isActive ? "var(--inverse-ink)" : "var(--muted)",
              background: isActive ? "var(--ink)" : "var(--surface)",
              border: "1px solid",
              borderColor: isActive ? "var(--ink)" : "var(--line)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: isActive ? "var(--ink)" : "var(--card)",
                color: isActive ? "var(--inverse-ink)" : "var(--ink)",
                borderColor: "var(--line-strong)",
              },
            }}
          >
            {cat}
          </Button>
        );
      })}
    </Box>
  );
}
