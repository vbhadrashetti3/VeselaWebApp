import EcosystemSection from "@/components/home/EcosystemSection";
import HeroSection from "@/components/home/HeroSection";
import Newsletter from "@/components/home/Newsletter";
import PhilosophySection from "@/components/home/PhilosophySection";
import { Box } from "@mui/material";

export default function HomePage() {
  return (
    <Box component="main">
      <HeroSection />
      <PhilosophySection />
      <EcosystemSection />
      <Newsletter />
    </Box>
  );
}
