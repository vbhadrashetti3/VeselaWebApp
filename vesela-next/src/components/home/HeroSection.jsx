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
  @keyframes heroWordFade {
    from { opacity: 0; }
    to   { opacity: 1; }
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

    // Play primary video
    v1.play().catch(() => { });

    const swap = () => {
      const active = activeRef.current;
      const next = active === v1 ? v2 : v1;

      // Prepare the next video at the very beginning so it's ready
      next.currentTime = 0;
      next.play().catch(() => { });

      // Cross-fade
      next.style.opacity = "1";
      active.style.opacity = "0";

      activeRef.current = next;
    };

    const onTimeUpdate = () => {
      const active = activeRef.current;
      if (!active || !active.duration || active.duration === Infinity) return;
      const remaining = active.duration - active.currentTime;
      if (remaining <= fadeDuration && remaining > 0) {
        // Detach listener so we only trigger once per cycle
        active.removeEventListener("timeupdate", onTimeUpdate);
        swap();
        // Re-attach on the new active video after the swap
        requestAnimationFrame(() => {
          activeRef.current.addEventListener("timeupdate", onTimeUpdate);
        });
      }
    };

    v1.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      v1.removeEventListener("timeupdate", onTimeUpdate);
      v2.removeEventListener("timeupdate", onTimeUpdate);
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
        padding: "0 2rem",
        paddingTop: "clamp(64px, 10vh, 120px)", // leave room for fixed nav
        textAlign: "center",
      }}
    >
      {/* ── Large animated logo ── */}
      <div
        style={{
          width: "250px",
          marginBottom: "2.5rem",
          pointerEvents: "none",
          ...anim(0, "0.9s"),
        }}
      >
        <Lottie
          animationData={heroSectionLottie}
          loop={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ── Headline ── */}
      <h1
        style={{
          fontSize: "35px",
          color: "white",
          fontWeight: 800,
          lineHeight: 1.5,
          maxWidth: "860px",
          letterSpacing: "-0.03em",
          margin: "0 0 1.75rem",
          ...anim(0.18),
        }}
      >
        Everyone&apos;s building AI that knows everything.{" "}
        <span style={{ fontStyle: "italic" }}>
          We&apos;re interested in AI that knows you.
        </span>
      </h1>

      {/* ── Glassmorphic search pill ── */}
      <div style={{ width: "100%", maxWidth: "640px", ...anim(0.38) }}>
        <AISearchInput onSearch={onSearch} />
      </div>
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
const IMAGE_DURATION_MS = 1800; // how long the static image is shown before the video fades in
const IMAGE_FADE_MS = 1200;     // fade duration for image → video transition

export default function HeroSection() {
  const router = useRouter();
  const { setPendingHeroMessage } = useChatSession();

  const [imageVisible, setImageVisible] = useState(true);
  const { vid1Ref, vid2Ref } = useCrossfadeVideos(1.2);

  const handleSearch = (message) => {
    setPendingHeroMessage(message);
    router.push("/chat");
  };

  // Begin cross-fading out the static image after a short delay so the
  // video has time to load and start playing without a blank frame.
  useEffect(() => {
    // Start both videos immediately so they're buffered and ready
    vid1Ref.current?.play().catch(() => { });

    const timer = setTimeout(() => {
      setImageVisible(false);
    }, IMAGE_DURATION_MS);

    return () => clearTimeout(timer);
    // vid1Ref / vid2Ref are stable refs — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Shared overlay gradient (slightly different opacity for image vs video) ──
  const OVERLAY_GRADIENT =
    "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.60) 100%)";

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: "640px",
        overflow: "hidden",
        background: "#0d0d0d", // fallback so no white flash while video loads
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Layer 0: primary-tinted dark fill (matches reference `bg-primary/40`) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(37, 5, 20, 0.40)", // #250514 @ 40% = primary/40
          zIndex: 0,
        }}
      />

      {/* ── Layer 1a: Video A (starts visible) ── */}
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
          transition: `opacity 1.2s ease-in-out`,
        }}
      />

      {/* ── Layer 1b: Video B (starts hidden, becomes visible on swap) ── */}
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
          transition: `opacity 1.2s ease-in-out`,
        }}
      />

      {/* ── Layer 2: Static hero image — fades out after IMAGE_DURATION_MS ── */}
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

      {/* ── Layer 3: Cinematic gradient overlay (sits above video & image) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: OVERLAY_GRADIENT,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 4: Interactive content (logo, heading, input) ── */}
      <HeroContent onSearch={handleSearch} />
    </section>
  );
}
