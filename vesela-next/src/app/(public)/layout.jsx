"use client";

import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";
import PromptLoginOnReturn from "@/components/user-auth/PromptLoginOnReturn";
import { PublicThemeRegistry } from "@/theme/ThemeRegistry";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home";
  const layoutClass = isHome ? "home-page" : "inner-page";

  return (
    <PublicThemeRegistry>
      <div className={layoutClass}>
        <PublicHeader />
        <PromptLoginOnReturn />
        {children}
        <PublicFooter />
      </div>
    </PublicThemeRegistry>
  );
}
