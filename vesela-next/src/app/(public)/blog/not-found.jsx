"use client";

import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function BlogNotFound() {
  return (
    <main style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "75vh" }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: "center",
            p: 5,
            borderRadius: 4,
            border: "1px solid var(--line)",
            background: "var(--card)",
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--surface)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              color: "var(--muted)",
            }}
          >
            <FileQuestion size={36} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: "var(--ink)" }}>
            Article Not Found
          </Typography>

          <Typography variant="body1" sx={{ color: "var(--muted)", mb: 4, lineHeight: 1.6 }}>
            The article you're looking for doesn't exist, may have been removed, or the web address might be incorrect.
          </Typography>

          <Button
            component={Link}
            href="/blog"
            variant="contained"
            startIcon={<ArrowLeft size={18} />}
            sx={{
              borderRadius: "9999px",
              px: 4,
              py: 1.2,
              background: "var(--ink)",
              color: "var(--inverse-ink)",
              "&:hover": {
                background: "var(--accent)",
                color: "#ffffff",
              },
            }}
          >
            Back to Blog
          </Button>
        </Box>
      </Container>
    </main>
  );
}
