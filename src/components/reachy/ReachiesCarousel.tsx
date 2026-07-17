"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

// Static list of the "reachies" stickers served from /public. The former Vite
// app used import.meta.glob; under Next we reference the public paths directly.
const BASE = "/assets/reachies/small-top-sided";
const IMAGE_PATHS = [
  `${BASE}/cooking-chief.png`,
  `${BASE}/farmer.png`,
  `${BASE}/fisherman.png`,
  `${BASE}/jazzman.png`,
  `${BASE}/rich.png`,
];

interface ReachiesCarouselProps {
  width?: number;
  height?: number;
  interval?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  zoom?: number;
  verticalAlign?: string;
  darkMode?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Displays the reachies stickers in sequence with an overlapping crossfade.
 * Images are preloaded and a random (non-repeating) one is shown each tick.
 */
export default function ReachiesCarousel({
  width = 100,
  height = 100,
  interval = 1000,
  fadeInDuration = 350,
  fadeOutDuration = 120,
  zoom = 1.8,
  verticalAlign = "center",
  darkMode = false,
  sx = {},
}: ReachiesCarouselProps) {
  const imagePaths = IMAGE_PATHS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeOutComplete, setFadeOutComplete] = useState(false);

  useEffect(() => {
    imagePaths.forEach((imagePath) => {
      const img = new Image();
      img.src = imagePath;
    });
  }, [imagePaths]);

  const getRandomIndex = (currentIdx: number, total: number) => {
    if (total <= 1) return 0;
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * total);
    } while (newIndex === currentIdx && total > 1);
    return newIndex;
  };

  useEffect(() => {
    if (imagePaths.length === 0) return;
    const timer = setInterval(() => {
      setPreviousIndex(currentIndex);
      setIsTransitioning(true);
      setFadeOutComplete(false);

      const newIndex = getRandomIndex(currentIndex, imagePaths.length);
      setCurrentIndex(newIndex);

      const overlapDelay = Math.min(fadeInDuration * 0.4, fadeOutDuration * 2);
      setTimeout(() => setFadeOutComplete(true), overlapDelay);

      setTimeout(() => {
        setIsTransitioning(false);
        setPreviousIndex(null);
        setFadeOutComplete(false);
      }, Math.max(fadeInDuration, fadeOutDuration));
    }, interval);

    return () => clearInterval(timer);
  }, [imagePaths.length, interval, currentIndex, fadeInDuration, fadeOutDuration]);

  return (
    <Box
      sx={{
        position: "relative",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...sx,
      }}
    >
      {imagePaths.map((imageSrc, index) => {
        const isActive = index === currentIndex;
        const isPrevious = index === previousIndex && isTransitioning;

        let topValue: number | string;
        let transformY: string;
        if (verticalAlign === "top") {
          topValue = 0;
          transformY = "0";
        } else if (verticalAlign === "bottom") {
          topValue = "100%";
          transformY = "-100%";
        } else if (typeof verticalAlign === "string" && verticalAlign.includes("%")) {
          topValue = verticalAlign;
          transformY = "-50%";
        } else {
          topValue = "50%";
          transformY = "-50%";
        }

        const baseOpacity = darkMode ? 0.8 : 0.9;
        let opacity = 0;
        let transitionStyle = "none";

        if (isActive) {
          opacity = baseOpacity;
          transitionStyle = `opacity ${fadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        } else if (isPrevious) {
          opacity = fadeOutComplete ? 0 : baseOpacity;
          transitionStyle = `opacity ${fadeOutDuration}ms cubic-bezier(0.4, 0, 1, 1)`;
        }

        return (
          <Box
            key={`${imageSrc}-${index}`}
            component="img"
            src={imageSrc}
            alt={`Reachy ${index + 1}`}
            sx={{
              position: "absolute",
              width: width * zoom,
              height: height * zoom,
              objectFit: "cover",
              objectPosition: "center top",
              opacity,
              transform: `translate(-50%, ${transformY})`,
              transition: transitionStyle,
              pointerEvents: "none",
              left: "50%",
              top: topValue,
              zIndex: isActive ? 2 : isPrevious ? 1 : 0,
              willChange: "opacity",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
        );
      })}
    </Box>
  );
}
