"use client";

import { Box, Typography } from "@mui/material";
import Lottie from "lottie-react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import heroSectionLottie from "../../../public/vesela_white_lottie.json";
import AISearchInput from "./AISearchInput";
import { useChatSession } from "@/context/ChatSessionContext";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUpKeyframes = `
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function anim(delay) {
  return {
    opacity: 0,
    animation: "heroFadeUp 0.7s ease forwards",
    animationDelay: `${delay}s`,
  };
}

// ─── Shared overlay content ───────────────────────────────────────────────────
function HeroContent({ onSearch }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 4, md: 8 },
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <Box sx={{ width: { xs: 90, md: 130 }, mb: 2, ...anim(0) }}>
        <Lottie animationData={heroSectionLottie} loop={false} />
      </Box>

      {/* Heading */}
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "1.55rem", sm: "1.9rem", md: "2.5rem" },
          color: "white",
          fontWeight: 600,
          lineHeight: 1.38,
          maxWidth: { xs: "100%", md: "780px" },
          letterSpacing: "-0.01em",
          ...anim(0.18),
        }}
      >
        Everyone&apos;s building AI that knows everything.{" "}
        <Box component="span" sx={{ fontWeight: 700 }}>
          We&apos;re interested in AI that knows you.
        </Box>
      </Typography>

      {/* Search */}
      <Box sx={{ mt: 4, width: "100%", ...anim(0.36) }}>
        <AISearchInput onSearch={onSearch} />
      </Box>
    </Box>
  );
}


const IMAGE_DURATION_MS = 5000;
const FADE_DURATION_MS = 900;

export default function HeroSection() {
  const router = useRouter();
  const { setPendingHeroMessage } = useChatSession();

  const videoRef = useRef(null);
  // Controls the image layer opacity (1 = image visible, 0 = video visible)
  const [imageVisible, setImageVisible] = useState(true);

  const handleSearch = (message) => {
    setPendingHeroMessage(message);
    router.push("/chat");
  };

  // Start video immediately and schedule the crossfade.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch((err) => {
      console.warn("[HeroSection] video autoplay blocked:", err);
    });

    const timer = setTimeout(() => {
      setImageVisible(false);
    }, IMAGE_DURATION_MS);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const OVERLAY_IMAGE = "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.62) 100%)";
  const OVERLAY_VIDEO = "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.68) 100%)";

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        // 100svh = small viewport height (excludes browser chrome on mobile).
        // Falls back to 100vh for browsers that don't support svh units.
        height: { xs: "100svh", fallback: "100vh" },
        minHeight: "-webkit-fill-available",
        overflow: "hidden",
      }}
    >
      <style>{fadeUpKeyframes}</style>

      {/* ── Layer 1 (bottom): Video ── */}
      <Box sx={{ position: "absolute", inset: 0 }}>
        <video
          ref={videoRef}
          src="/hero-video-2.mp4"
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Video overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: OVERLAY_VIDEO,
            zIndex: 1,
          }}
        />
      </Box>

      {/* ── Layer 2 (top): Image — fades out after IMAGE_DURATION_MS ── */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: imageVisible ? 1 : 0,
          transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
          // Pointer-events off once faded so clicks reach the video layer.
          pointerEvents: imageVisible ? "auto" : "none",
        }}
      >
        <Box
          component="img"
          src="/hero-1.png"
          alt=""
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Image overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: OVERLAY_IMAGE,
            zIndex: 1,
          }}
        />
      </Box>

      {/* ── Overlay content (logo, heading, search) — always on top ── */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 3 }}>
        <HeroContent onSearch={handleSearch} />
      </Box>
    </Box>
  );
}
