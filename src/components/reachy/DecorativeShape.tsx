"use client";

import { useEffect, useState, type CSSProperties } from "react";

type ShapeType = "circle" | "square" | "ring" | "squareOutline" | "dot";

interface DecorativeShapeProps {
  color?: string;
  size?: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  type?: ShapeType;
  rotation?: number;
  opacity?: number;
  floatRange?: number;
  floatSpeed?: number;
  scrollFactor?: number;
  zIndex?: number;
}

/**
 * Decorative floating shape. The former Vite app used react-spring for
 * smoothing; here we drive the transform directly from a rAF loop + scroll
 * position to avoid pulling an animation dependency into the SSR bundle.
 */
export default function DecorativeShape({
  color = "#FF9500",
  size = 80,
  top,
  left,
  right,
  bottom,
  type = "circle",
  rotation = 0,
  opacity = 0.12,
  floatRange = 6,
  floatSpeed = 5000,
  scrollFactor = 0.03,
  zIndex = 0,
}: DecorativeShapeProps) {
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

  const baseStyles: CSSProperties = {
    position: "absolute",
    top,
    left,
    right,
    bottom,
    width: size,
    height: size,
    pointerEvents: "none",
    zIndex,
    transform: `translateY(${floatOffset + scrollY * scrollFactor}px) rotate(${rotation}deg)`,
  };

  const shapeStyles: Record<ShapeType, CSSProperties> = {
    circle: { borderRadius: "50%", background: color, opacity },
    ring: {
      borderRadius: "50%",
      background: "transparent",
      border: `2px solid ${color}`,
      opacity: opacity * 1.5,
    },
    square: { borderRadius: size * 0.15, background: color, opacity },
    squareOutline: {
      borderRadius: size * 0.15,
      background: "transparent",
      border: `2px solid ${color}`,
      opacity: opacity * 1.5,
    },
    dot: { borderRadius: "50%", background: color, opacity: opacity * 2 },
  };

  return <div style={{ ...baseStyles, ...shapeStyles[type] }} />;
}
