"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function BlogEmptyState({ search, onReset }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
        my: 4,
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 2,
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "var(--ink)" }}>
        {search ? "No articles found." : "No articles available."}
      </Typography>

      {onReset && (
        <Button
          variant="outlined"
          onClick={onReset}
          size="small"
          sx={{
            mt: 2,
            borderRadius: "9999px",
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        >
          View All Articles
        </Button>
      )}
    </Box>
  );
}
