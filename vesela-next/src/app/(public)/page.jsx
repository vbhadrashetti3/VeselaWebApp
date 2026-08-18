import HomePageContent from "@/components/home/HomePageContent";
import ClientRedirect from "@/components/home/ClientRedirect";

export const metadata = {
  title: "Human Alignment AI",
  description:
    "Everyone's building AI that knows everything. Vesela is human alignment AI designed to deepen your thinking—not replace it.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vesela | Human Alignment AI",
    description:
      "A human connection expert designed to deepen your thinking—not replace it.",
    url: "/",
  },
};

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
