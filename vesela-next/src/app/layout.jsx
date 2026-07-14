import "./globals.css";
import { Inter, Manrope, IBM_Plex_Mono } from "next/font/google";
import { ModalProvider } from "@/context/ModalContext";
import { ChatSessionProvider } from "@/context/ChatSessionContext";
import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from "@/theme/ThemeRegistry";
import GlobalModals from "../components/modals/GlobalModals";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "400", "700", "800"],
  variable: "--font-manrope",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

// Viewport meta — prevents iOS auto-zoom and sets correct initial scale
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: "Vesela",
  description: "Vesela Chat App",
  icons: {
    icon: "/favicon.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${ibmPlexMono.variable}`}>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <ChatSessionProvider>
              <ModalProvider>
                {children}
                <GlobalModals />
                <Script
                  src="https://accounts.google.com/gsi/client"
                  strategy="afterInteractive"
                />
              </ModalProvider>
            </ChatSessionProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
