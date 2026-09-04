"use client";

import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

// The orb clips are tens of MB, so they live on a CDN/bucket rather than in git.
// Defaults to /public/voice so a developer who has the files locally still works.
const ASSET_BASE = (
  process.env.NEXT_PUBLIC_VOICE_ASSET_BASE_URL || "/voice"
).replace(/\/+$/, "");

const asset = (name) => `${ASSET_BASE}/${name}.mp4`;

const ASSETS = {
  dark: {
    introBase: asset("intro-base-dark"),
    introGlow: asset("intro-glow-dark"),
    loopBase: asset("loop-base-dark"),
    loopGlow: asset("loop-glow-dark"),
  },
  light: {
    introBase: asset("intro-base-light"),
    introGlow: asset("intro-glow-light"),
    loopBase: asset("loop-base-light"),
    loopGlow: asset("loop-glow-light"),
  },
};

const FRAME_DRIFT = 0.025;

function VideoLayer({ src, videoRef, loop, onEnded, opacity = 1, autoPlay = false }) {
  return (
    <Box
      component="video"
      ref={videoRef}
      src={src}
      muted
      playsInline
      autoPlay={autoPlay}
      preload="auto"
      loop={loop}
      onEnded={onEnded}
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

export default function VoiceOrb({ themeMode = "dark", activityLevel = 0 }) {
  const assets = ASSETS[themeMode === "light" ? "light" : "dark"];
  const [phase, setPhase] = useState("intro");
  const introBaseRef = useRef(null);
  const introGlowRef = useRef(null);
  const loopBaseRef = useRef(null);
  const loopGlowRef = useRef(null);

  const glowOpacity = Math.min(0.96, Math.pow(Math.max(0, activityLevel), 0.62));

  useEffect(() => {
    const introBase = introBaseRef.current;
    const introGlow = introGlowRef.current;
    if (!introBase || !introGlow) return undefined;

    introBase.currentTime = 0;
    introGlow.currentTime = 0;
    const play = () => {
      introGlow.play().catch(() => undefined);
      introBase.play().catch(() => undefined);
    };
    play();

    const sync = () => {
      if (Math.abs(introGlow.currentTime - introBase.currentTime) > FRAME_DRIFT) {
        introGlow.currentTime = introBase.currentTime;
      }
    };
    introBase.addEventListener("timeupdate", sync);
    return () => introBase.removeEventListener("timeupdate", sync);
  }, [assets]);

  useEffect(() => {
    if (phase !== "loop") return undefined;
    const loopBase = loopBaseRef.current;
    const loopGlow = loopGlowRef.current;
    if (!loopBase || !loopGlow) return undefined;

    loopBase.currentTime = 0;
    loopGlow.currentTime = 0;
    introBaseRef.current?.pause();
    introGlowRef.current?.pause();
    loopGlow.play().catch(() => undefined);
    loopBase.play().catch(() => undefined);

    const sync = () => {
      if (Math.abs(loopGlow.currentTime - loopBase.currentTime) > FRAME_DRIFT) {
        loopGlow.currentTime = loopBase.currentTime;
      }
    };
    loopBase.addEventListener("timeupdate", sync);
    return () => loopBase.removeEventListener("timeupdate", sync);
  }, [phase]);

  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: phase === "intro" ? 1 : 0,
        }}
      >
        <VideoLayer
          src={assets.introBase}
          videoRef={introBaseRef}
          autoPlay
          onEnded={() => setPhase("loop")}
        />
        <VideoLayer
          src={assets.introGlow}
          videoRef={introGlowRef}
          autoPlay
          opacity={glowOpacity}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: phase === "loop" ? 1 : 0,
        }}
      >
        <VideoLayer src={assets.loopBase} videoRef={loopBaseRef} loop />
        <VideoLayer src={assets.loopGlow} videoRef={loopGlowRef} loop opacity={glowOpacity} />
      </Box>
    </Box>
  );
}
