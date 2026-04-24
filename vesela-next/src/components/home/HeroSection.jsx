"use client";

import { Box, InputBase, Typography } from "@mui/material";
import Lottie from "lottie-react";
import Carousel from "react-material-ui-carousel";
import heroSectionLottie from "../../../public/veselaLottiewhitelettersUNIFORM.json";
import AISearchInput from "./AISearchInput";

const headingStyle = {
  fontSize: { xs: "1.5rem", md: "2.2rem" },
  color: "white",
  lineHeight: "1.4",
  fontWeight: 500,
};

export default function HeroSection() {
  const slides = [
    {
      type: "image",
      title: "Everyone’s building AI that knows everything.",
      subtitle: "We’re interested in AI that",
      highlight: "knows you.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDFmXQhlTARowTvUP6mAdl5DFkpA5RposDF85W8efwt-JIRZroolJIM2WfQScUE-q2UsTmr0UzDC5JwM_tPU5O3A1Nb16GbIN9ERFInOvneFZ4H7oyEy9hqlXYVJz8w1y7wAdgQi9Ku43Tovk2DF8tPcxiur4G7KyFdkpmQWBzv-MUBOD-SxHxJA-CAAQviDyyq_4xienAHnWZuJAqTc4b5yjPC1jKjI3Hngv2Bp0FFSmEaz8FUfD5MogHZ5alEgzbxXjsWDdmjX88",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Carousel
        autoPlay
        animation="fade"
        indicators={false}
        duration={1000}
        interval={6000}
      >
        {slides.map((slide, i) => (
          <Box key={i} sx={{ height: "100vh", position: "relative" }}>
            {/* 🔹 Background */}
            {slide.type === "video" ? (
              <video
                src={slide.video}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                component="img"
                src={slide.image}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            {/* 🔹 Dark Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.5)",
                zIndex: 1,
              }}
            />

            {/* 🔹 Content */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                zIndex: 2,
                px: 2,
                width: "100%",
              }}
            >
              {/* 🔹 Lottie */}
              {slide.type === "image" && (
                <Box
                  sx={{
                    width: { xs: 120, md: 400 },
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Lottie animationData={heroSectionLottie} loop={false} />
                </Box>
              )}
              <Box sx={{ mt: -4 }}>
                {/* 🔹 Text */}
                <Typography sx={headingStyle}>{slide.title}</Typography>

                <Typography sx={headingStyle}>
                  {slide.subtitle}{" "}
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    {slide.highlight}
                  </Box>
                </Typography>
              </Box>

              <Box>
                <AISearchInput />
              </Box>
            </Box>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}
