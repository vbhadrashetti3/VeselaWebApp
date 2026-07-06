"use client";

import Lottie from "lottie-react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import heroSectionLottie from "../../../public/vesela_white_lottie.json";
import AISearchInput from "./AISearchInput";
import { useChatSession } from "@/context/ChatSessionContext";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function anim(delay, duration = "0.75s") {
  return {
    opacity: 0,
    animation: `heroFadeUp ${duration} cubic-bezier(0.22, 1, 0.36, 1) forwards`,
    animationDelay: `${delay}s`,
  };
}

function useCrossfadeVideos(fadeDuration = 1.2) {
  const vid1Ref = useRef(null);
  const vid2Ref = useRef(null);
  const activeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const v1 = vid1Ref.current;
    const v2 = vid2Ref.current;
    if (!v1 || !v2) return;

    activeRef.current = v1;
    v1.play().catch(() => { });

    const swap = () => {
      const active = activeRef.current;
      const next = active === v1 ? v2 : v1;

      next.currentTime = 0;
      next.play().catch(() => { });

      next.style.opacity = "1";
      active.style.opacity = "0";

      activeRef.current = next;
    };

    const onTimeUpdate = () => {
      const active = activeRef.current;
      if (!active || !active.duration || active.duration === Infinity) return;
      const remaining = active.duration - active.currentTime;
      if (remaining <= fadeDuration && remaining > 0) {
        active.removeEventListener("timeupdate", onTimeUpdate);
        swap();
        requestAnimationFrame(() => {
          activeRef.current?.addEventListener("timeupdate", onTimeUpdate);
        });
      }
    };

    v1.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      v1?.removeEventListener("timeupdate", onTimeUpdate);
      v2?.removeEventListener("timeupdate", onTimeUpdate);
      clearTimeout(timeoutRef.current);
    };
  }, [fadeDuration]);

  return { vid1Ref, vid2Ref };
}

// ─── HeroContent ─────────────────────────────────────────────────────────────
function HeroContent({ onSearch }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1.5rem",
        paddingTop: "clamp(80px, 12vh, 140px)",
        textAlign: "center",
      }}
    >
      {/* ── Large animated logo (Responsive boundary constraints applied) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "auto",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "6rem",
          ...anim(0, "0.9s"),
        }}
      >
        <Lottie
          animationData={heroSectionLottie}
          loop={false}
          style={{ width: "100%", height: "100%", transform: "scale(1.05)" }}
        />
      </div>

      {/* ── Headline (Structured line-by-line using block wrappers) ── */}
      <h1
        style={{
          fontSize: "55px",
          fontFamily: "var(--font-manrope), 'Manrope', sans-serif",
          color: "#FFFFFF",
          fontWeight: 800,
          lineHeight: 1.2,
          maxWidth: "1000px",
          letterSpacing: "-0.03em",
          margin: "0 0 2.5rem",
          ...anim(0.18, "0.8s"),
        }}
      >
        <span style={{ display: "block", marginBottom: "0.25rem" }}>
          Everyone&apos;s building AI that knows everything. We&apos;re interested in AI that
        </span>

        <span style={{ display: "block", fontStyle: "italic", fontWeight: 300 }}>
          knows you.
        </span>
      </h1>

      {/* ── Glassmorphic search pill ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          marginTop: "1rem",
          ...anim(0.38, "0.8s"),
        }}
      >
        <AISearchInput onSearch={onSearch} />
      </div>
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
const IMAGE_DURATION_MS = 1800;
const IMAGE_FADE_MS = 1200;

export default function HeroSection() {
  const router = useRouter();
  const { setPendingHeroMessage } = useChatSession();

  const [imageVisible, setImageVisible] = useState(true);
  const { vid1Ref, vid2Ref } = useCrossfadeVideos(1.2);

  const handleSearch = (message) => {
    setPendingHeroMessage(message);
    router.push("/chat");
  };

  useEffect(() => {
    vid1Ref.current?.play().catch(() => { });

    const timer = setTimeout(() => {
      setImageVisible(false);
    }, IMAGE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [vid1Ref]);

  const OVERLAY_GRADIENT =
    "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.60) 100%)";

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: "800px",
        overflow: "hidden",
        background: "#0d0d0d",
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Layer 0: Primary-tinted dark background color mask ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(37, 5, 20, 0.40)",
          zIndex: 0,
        }}
      />

      {/* ── Layer 1a: Video A ── */}
      <video
        ref={vid1Ref}
        src="/hero-video-2.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          opacity: 1,
          transition: "opacity 1.2s ease-in-out",
        }}
      />

      {/* ── Layer 1b: Video B ── */}
      <video
        ref={vid2Ref}
        src="/hero-video-2.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          opacity: 0,
          transition: "opacity 1.2s ease-in-out",
        }}
      />

      {/* ── Layer 2: Static Frame Image ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          opacity: imageVisible ? 1 : 0,
          transition: `opacity ${IMAGE_FADE_MS}ms ease-in-out`,
          pointerEvents: "none",
        }}
      >
        <img
          src="/hero-1.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* ── Layer 3: Gradient Mask Overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: OVERLAY_GRADIENT,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 4: Viewport Content Grid ── */}
      <HeroContent onSearch={handleSearch} />
    </section>
  );
}