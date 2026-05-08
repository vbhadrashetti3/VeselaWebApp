import { Urbanist } from "next/font/google";
import { ModalProvider } from "@/context/ModalContext";
import ThemeRegistry from "@/theme/ThemeRegistry";
import GlobalModals from "../components/modals/GlobalModals";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ✅ Add metadata here
export const metadata = {
  title: "Vesela",
  description: "Vesela Chat App",
  icons: {
    icon: "/favicon.webp", // or /icon.png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={urbanist.className}>
      <body>
        <ThemeRegistry>
          <ModalProvider>
            {children}
            <GlobalModals />
          </ModalProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
