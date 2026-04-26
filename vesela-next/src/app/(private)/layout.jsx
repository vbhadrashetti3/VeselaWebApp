// app/(private)/layout.jsx

import PrivateHeader from "@/components/private/PrivateHeader";
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
      <PrivateHeader />
      {children}
    </Box>
  );
}
