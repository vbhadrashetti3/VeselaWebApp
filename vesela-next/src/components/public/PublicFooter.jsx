"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import { useColorMode } from "@/theme/ThemeRegistry";

import VeselaLogoBlack from "../../../public/vesela_black_lottie.json";
import VeselaLogoWhite from "../../../public/vesela_white_lottie.json";

export default function PublicFooter() {
  const { mode } = useColorMode();
  const isLightMode = mode === "light";
  const logoData = isLightMode ? VeselaLogoBlack : VeselaLogoWhite;

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <Link href="/" className="footer-logo" aria-label="Vesela home">
            <div className="lottie-logo">
              <Lottie
                animationData={logoData}
                loop={false}
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              />
            </div>
          </Link>

          <nav className="footer-links" aria-label="Footer">
            <Link href="/home#philosophy">Philosophy</Link>
            <Link href="/pricing">Pricing</Link>
            <a href="https://humanitybench.org" target="_blank" rel="noopener noreferrer">
              Humanity Bench
            </a>
            <a href="https://grayskyai.com" target="_blank" rel="noopener noreferrer">
              Gray Sky AI
            </a>
            <a href="https://humanalignmentai.com" target="_blank" rel="noopener noreferrer">
              Alignment AI
            </a>
          </nav>

          <div className="socials">
            <a
              className="social-link"
              href="https://www.instagram.com/veselaai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vesela on Instagram"
            >
              IG
            </a>
            <a
              className="social-link"
              href="https://x.com/Vesela_AI"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vesela on X"
            >
              X
            </a>
            <a
              className="social-link"
              href="https://www.facebook.com/profile.php?id=61590435089447"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vesela on Facebook"
            >
              f
            </a>
            <a
              className="social-link"
              href="https://x.com/GraySkyAI"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gray Sky AI on X"
            >
              GS
            </a>
            <a
              className="social-link"
              href="https://www.facebook.com/share/1EKB8N6bqi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gray Sky AI on Facebook"
            >
              f
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Gray Sky AI · Human alignment AI</span>
          <span>
            <img
              className="graysky-logo theme-logo-light"
              src="/assets/graysky-black.png"
              alt="Gray Sky AI"
            />
            <img
              className="graysky-logo theme-logo-dark"
              src="/assets/graysky-white.png"
              alt="Gray Sky AI"
            />
          </span>
        </div>
      </div>
    </footer>
  );
}