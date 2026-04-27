import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";
import { Box } from "@mui/material";

export default function PublicLayout({ children }) {
  return (
    <Box>
      <PublicHeader />
      {children}
      <PublicFooter />
    </Box>
  );
}
