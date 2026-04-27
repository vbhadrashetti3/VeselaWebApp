import { Urbanist } from "next/font/google";
import { ModalProvider } from "@/context/ModalContext";
import ThemeRegistry from "@/theme/ThemeRegistry";
import GlobalModals from "../components/modals/GlobalModals";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
