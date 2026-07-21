"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Box, Container, Typography, Chip, Stack } from "@mui/material";

function useFloat(floatSpeed: number, floatRange: number, scrollFactor: number) {
  const [floatOffset, setFloatOffset] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      setFloatOffset(Math.sin((elapsed / floatSpeed) * Math.PI * 2) * floatRange);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [floatSpeed, floatRange]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return floatOffset + scrollY * scrollFactor;
}

interface StickerConfig {
  src: string;
  size?: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  rotation?: number;
  floatRange?: number;
  floatSpeed?: number;
  scrollFactor?: number;
}

function FloatingSticker({
  src,
  size = 200,
  top,
  left,
  right,
  bottom,
  rotation = 0,
  floatRange = 12,
  floatSpeed = 5500,
  scrollFactor = 0.03,
}: StickerConfig) {
  const offset = useFloat(floatSpeed, floatRange, scrollFactor);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: "auto",
        pointerEvents: "none",
        zIndex: 2,
        transform: `translateY(${offset}px) rotate(${rotation}deg)`,
      }}
    />
  );
}

type PrimitiveType = "circle" | "ring" | "square" | "squareOutline";

interface PrimitiveConfig {
  type?: PrimitiveType;
  color?: string;
  size?: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  rotation?: number;
  floatRange?: number;
  floatSpeed?: number;
  scrollFactor?: number;
}

function FloatingPrimitive({
  type = "circle",
  color = "#764ba2",
  size = 80,
  top,
  left,
  right,
  bottom,
  rotation = 0,
  floatRange = 8,
  floatSpeed = 5000,
  scrollFactor = 0.02,
}: PrimitiveConfig) {
  const offset = useFloat(floatSpeed, floatRange, scrollFactor);
  const shapeStyles: Record<PrimitiveType, React.CSSProperties> = {
    circle: { borderRadius: "50%", background: color, opacity: 0.15 },
    ring: {
      borderRadius: "50%",
      background: "transparent",
      border: `2px solid ${color}`,
      opacity: 0.2,
    },
    square: { borderRadius: size * 0.15, background: color, opacity: 0.12 },
    squareOutline: {
      borderRadius: size * 0.15,
      background: "transparent",
      border: `2px solid ${color}`,
      opacity: 0.18,
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 1,
        transform: `translateY(${offset}px) rotate(${rotation}deg)`,
        ...shapeStyles[type],
      }}
    />
  );
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  meta,
  children,
  stickers = [],
  primitives = [],
  accentColor = "#764ba2",
  icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  children?: ReactNode;
  stickers?: StickerConfig[];
  primitives?: PrimitiveConfig[];
  accentColor?: string;
  icon?: ReactNode;
}) {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        color: "white",
        // The shared Pollen strip (44px) sits above the Reachy header, so the
        // combined chrome is ~44px taller than on the original site. Clear it
        // with extra top padding to keep the original breathing room.
        pt: { xs: 22, md: 24 },
        pb: { xs: 10, md: 12 },
        position: "relative",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${accentColor}25 0%, transparent 60%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          left: "5%",
          width: 350,
          height: 350,
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        {stickers.map((sticker, i) => (
          <FloatingSticker
            key={i}
            {...sticker}
            floatSpeed={sticker.floatSpeed || 5500 + i * 500}
          />
        ))}
      </Box>

      {primitives.map((prim, i) => (
        <FloatingPrimitive
          key={i}
          {...prim}
          color={prim.color || accentColor}
          floatSpeed={prim.floatSpeed || 5000 + i * 400}
        />
      ))}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        {icon && (
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              mb: 3,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}99 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              boxShadow: `0 8px 32px ${accentColor}40`,
            }}
          >
            {icon}
          </Box>
        )}

        {eyebrow && (
          <Chip
            label={eyebrow}
            sx={{
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.9)",
              mb: 3,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.05em",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        )}

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 36, md: 52 },
            fontWeight: 700,
            mb: 3,
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            // Gradient text clips its fill to the line box; without a bit of room
            // the tight h1 line-height slices descenders (g, y, p).
            lineHeight: 1.2,
            pb: "0.1em",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 600,
              mx: "auto",
              mb: 4,
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {meta && <Box sx={{ mt: subtitle ? 1 : 3 }}>{meta}</Box>}

        {children && (
          <Stack direction="row" spacing={2} useFlexGap sx={{ justifyContent: "center", flexWrap: "wrap" }}>
            {children}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
