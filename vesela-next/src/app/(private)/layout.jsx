// app/(private)/layout.jsx

import { Box } from "@mui/material";

export default function PrivateLayout({ children }) {
  return (
    <Box
      sx={{
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {children}
    </Box>
  );
}
