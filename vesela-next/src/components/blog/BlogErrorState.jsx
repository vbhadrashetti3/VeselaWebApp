"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function BlogErrorState({ onRetry }) {
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
        Unable to load articles.
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--muted)", mb: 3 }}>
        Please try again later.
      </Typography>

      {onRetry && (
        <Button
          variant="outlined"
          onClick={onRetry}
          size="small"
          sx={{
            borderRadius: "9999px",
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}
