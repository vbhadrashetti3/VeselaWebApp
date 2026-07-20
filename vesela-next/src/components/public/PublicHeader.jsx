"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { localStorageUtil } from "@/utils/localStorageUtil";

import { useModal } from "@/context/ModalContext";
import { useColorMode } from "@/theme/ThemeRegistry";
import { MODALS } from "../modals/modalConstants";

import VeselaLogoBlack from "../../../public/vesela_black_lottie.json";
import VeselaLogoWhite from "../../../public/vesela_white_lottie.json";
import { POST_LOGIN_NAVIGATE_TO, WELCOME_COMPLETED } from "@/constant";
import { useAuth } from "@/context/AuthContext";

export default function PublicHeader() {
  const { openModal } = useModal();
  const { mode, toggleColorMode } = useColorMode();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Both "/" and "/home" are the home experience — treat them identically
  const isHome = pathname === "/" || pathname === "/home";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setScrolled(scrollTop > 36);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignIn = () => {
    // If already authenticated, skip the modal and navigate directly
    if (isAuthenticated) {
      const hasCompletedWelcome = localStorageUtil.get(WELCOME_COMPLETED);
      router.push(hasCompletedWelcome ? "/chat" : "/welcome");
      return;
    }
    // Signal SuccessfulModal to send new users to /welcome after login
    localStorageUtil.set(POST_LOGIN_NAVIGATE_TO, "/welcome");
    openModal(MODALS.LOGIN, { source: "public" });
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    if (typeof document !== "undefined") {
      document.body.classList.toggle("menu-open", next);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    if (typeof document !== "undefined") {
      document.body.classList.remove("menu-open");
    }
  };

  // Determine logo variant
  // On the home page, the background under the header is always dark (hero video or dark scrolled header).
  // On inner pages (like /pricing), the background matches the theme mode (light or dark).
  const isLightMode = mode === "light";
  const useBlackLogo = isLightMode && !isHome;
  const logoData = useBlackLogo ? VeselaLogoBlack : VeselaLogoWhite;

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <Link href="/home" className="brand" aria-label="Vesela home" onClick={closeMenu}>
            <div className="lottie-logo">
              <Lottie
                animationData={logoData}
                loop={false}
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              />
            </div>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            <Link href={isHome ? "#philosophy" : "/#philosophy"}>Philosophy</Link>
            <Link href={isHome ? "#experience" : "/#experience"}>Experience</Link>
            <Link href={isHome ? "#proof" : "/#proof"}>Proof</Link>
            <Link href="/pricing" aria-current={pathname === "/pricing" ? "page" : undefined}>Pricing</Link>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              onClick={toggleColorMode}
              aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
            >
              <span className="theme-icon" aria-hidden="true"></span>
            </button>

            <button
              className={`button header-cta ${isHome ? "" : "primary"}`}
              type="button"
              onClick={handleSignIn}
            >
              Sign In
            </button>

            <button
              className="menu-button"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-label="Mobile">
        <Link href={isHome ? "#philosophy" : "/#philosophy"} onClick={toggleMenu}>Philosophy</Link>
        <Link href={isHome ? "#experience" : "/#experience"} onClick={toggleMenu}>Experience</Link>
        <Link href={isHome ? "#proof" : "/#proof"} onClick={toggleMenu}>Proof</Link>
        <Link href="/pricing" onClick={toggleMenu}>Pricing</Link>
        <Link href={isHome ? "#download" : "/pricing#plans"} onClick={toggleMenu}>
          {isHome ? "Get the app" : "Choose a plan"}
        </Link>
        <p className="mobile-meta">Human alignment AI · Gray Sky AI</p>
      </nav>
    </>
  );
}