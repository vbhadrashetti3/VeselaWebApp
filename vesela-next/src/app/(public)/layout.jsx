import PublicNavbar from "@/components/public/Navbar";
import { Box } from "@mui/material";

export default function PublicLayout({ children }) {
  return (
    <Box>
      <PublicNavbar />
      {children}
      {/* Add your footer here */}
    </Box>
  );
}
