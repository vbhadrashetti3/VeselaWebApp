import EcosystemSection from "@/components/home/EcosystemSection";
import HeroSection from "@/components/home/HeroSection";
import Newsletter from "@/components/home/Newsletter";
import PhilosophySection from "@/components/home/PhilosophySection";
import { Box } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientRedirect from "@/components/home/ClientRedirect";

// Prevent static prerendering — page uses client-only theme context
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("my-app-auth")?.value;

  if (token) {
    redirect("/chat");
  }

  return (
    <Box component="main">
      <ClientRedirect />
      <HeroSection />
      <PhilosophySection />
      <EcosystemSection />
      <Newsletter />
    </Box>
  );
}
