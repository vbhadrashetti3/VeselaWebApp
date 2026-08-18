import HomePageContent from "@/components/home/HomePageContent";

export const metadata = {
  title: "Human Alignment AI",
  description:
    "Everyone's building AI that knows everything. Vesela is human alignment AI designed to deepen your thinking—not replace it.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
