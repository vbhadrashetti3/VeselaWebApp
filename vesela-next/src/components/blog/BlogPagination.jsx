"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function BlogPagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <Box
      component="nav"
      aria-label="Blog pagination"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        mt: 6,
        mb: 2,
      }}
    >
      <Button
        variant="text"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        startIcon={<ArrowLeft size={16} />}
        aria-label="Previous Page"
        sx={{
          color: "var(--ink)",
          fontWeight: 500,
          "&.Mui-disabled": {
            color: "var(--muted)",
            opacity: 0.4,
          },
        }}
      >
        Previous
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mx: 1 }}>
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <Button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={isActive ? "page" : undefined}
              sx={{
                minWidth: 32,
                height: 32,
                p: 0,
                borderRadius: 1,
                fontSize: "0.875rem",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "var(--inverse-ink)" : "var(--ink)",
                background: isActive ? "var(--ink)" : "transparent",
                "&:hover": {
                  background: isActive ? "var(--ink)" : "var(--surface)",
                },
              }}
            >
              {p}
            </Button>
          );
        })}
      </Box>

      <Button
        variant="text"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        endIcon={<ArrowRight size={16} />}
        aria-label="Next Page"
        sx={{
          color: "var(--ink)",
          fontWeight: 500,
          "&.Mui-disabled": {
            color: "var(--muted)",
            opacity: 0.4,
          },
        }}
      >
        Next
      </Button>
    </Box>
  );
}
