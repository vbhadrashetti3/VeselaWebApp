import HomePageContent from "@/components/home/HomePageContent";
import ClientRedirect from "@/components/home/ClientRedirect";

export default function RootPage() {
  return (
    <>
      {/* ClientRedirect only lives here — not in HomePageContent — so
          authenticated users navigating to /home stay on /home. */}
      <ClientRedirect />
      <HomePageContent />
    </>
  );
}
