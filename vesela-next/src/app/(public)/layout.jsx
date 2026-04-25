import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/PublicFooter";
import { Box } from "@mui/material";

export default function PublicLayout({ children }) {
  return (
    <Box>
      <PublicNavbar />
      {children}
      {/* Add your footer here */}
      <PublicFooter />
    </Box>
  );
}
