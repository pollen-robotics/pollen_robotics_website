"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box } from "@mui/material";
import { POLLEN_MARK, HF_LOGO } from "@/lib/brand";
import type { Zone } from "./ZoneProvider";

// Per-zone tint. Each header blends into the top of its zone's hero so the bar
// reads as part of the page rather than a separate chrome element.
const TINTS: Record<
  Zone,
  { bg: string; fg: string; accent: string; border: string; blur: string }
> = {
  pollen: {
    bg: "rgba(250, 250, 250, 0.72)",
    fg: "#1d1d1f",
    accent: "#ff9500",
    border: "rgba(0, 0, 0, 0.08)",
    blur: "saturate(180%) blur(12px)",
  },
  reachy: {
    // Mirrors the Reachy product header's scrolled state (frosted white) so the
    // two bars read as one cohesive piece of chrome once the user scrolls.
    bg: "rgba(255, 255, 255, 0.85)",
    fg: "#1d1d1f",
    accent: "#FF9500",
    border: "rgba(0, 0, 0, 0.08)",
    blur: "saturate(180%) blur(20px)",
  },
  reachy2: {
    // Frosted white on scroll; transparent over the dark hero at the top.
    bg: "rgba(255, 255, 255, 0.85)",
    fg: "#0a0a0b",
    accent: "#FF9500",
    border: "rgba(0, 0, 0, 0.08)",
    blur: "saturate(180%) blur(20px)",
  },
};

const NAV: { id: Zone; label: string; href: string }[] = [
  { id: "pollen", label: "Pollen", href: "/" },
  { id: "reachy2", label: "Reachy 2", href: "/reachy-2" },
  { id: "reachy", label: "Reachy Mini", href: "/reachy-mini" },
];

export default function Header({
  active,
  overlay = false,
  transparentAtTop = false,
}: {
  active: Zone;
  // When true, the bar floats over the page (fixed) so a hero/video shows
  // through beneath it, instead of taking its own 44px of layout (sticky).
  overlay?: boolean;
  // When true (and in overlay mode), the bar is transparent at the top of the
  // page and only adopts its zone tint once the user scrolls. Used on Reachy's
  // marketing pages so the hero video passes under the bar.
  transparentAtTop?: boolean;
}) {
  const tint = TINTS[active];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Same threshold as the Reachy product header so both bars react in
    // lockstep on scroll (color in overlay mode, logo shift everywhere).
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showTransparent = overlay && transparentAtTop && !scrolled;

  return (
    <Box
      component="header"
      sx={{
        position: overlay ? "fixed" : "sticky",
        top: 0,
        left: 0,
        right: 0,
        // Below the mobile drawer (1200) so it dims under the menu overlay;
        // it never overlaps the Reachy AppBar since that sits 44px lower.
        zIndex: overlay ? 1100 : 1300,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          height: 44,
          // Content stays tucked toward the edges at all times (no scroll-based
          // reposition): the brand hugs the left, the nav hugs the right.
          px: { xs: 1, md: 1.5, lg: 2 },
          // Pin the topbar font so it stays identical across every zone,
          // regardless of the (possibly absent) per-zone MUI theme.
          fontFamily: "var(--font-dm-sans)",
          bgcolor: showTransparent ? "transparent" : tint.bg,
          // Text follows the background: white over the hero, dark once tinted.
          color: showTransparent ? "#ffffff" : tint.fg,
          // Light bottom hairline, always present (adapts to the background).
          borderBottom: `1px solid ${
            showTransparent ? "rgba(255, 255, 255, 0.14)" : tint.border
          }`,
          backdropFilter: showTransparent ? "none" : tint.blur,
          WebkitBackdropFilter: showTransparent ? "none" : tint.blur,
          // Match the Reachy product header's timing exactly so the two bars
          // move as one on scroll.
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Box
          component={Link}
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            color: "inherit",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontSize: "0.95rem",
          }}
        >
          <Box
            component="img"
            src={POLLEN_MARK}
            alt=""
            aria-hidden="true"
            sx={{ display: "block", width: 20, height: 20, objectFit: "contain" }}
          />
          <span>Pollen Robotics</span>
          <Box
            component="span"
            aria-hidden="true"
            sx={{ mx: "0.15rem", fontWeight: 400, fontSize: "0.85rem", opacity: 0.4 }}
          >
            ×
          </Box>
          <Box
            component="img"
            src={HF_LOGO}
            alt="Hugging Face"
            sx={{ display: "block", height: 20, width: "auto", objectFit: "contain" }}
          />
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Hugging Face
          </Box>
        </Box>

        <Box
          component="nav"
          sx={{
            display: "flex",
            alignItems: "stretch",
            alignSelf: "stretch",
            gap: "clamp(0.75rem, 2.5vw, 1.75rem)",
          }}
        >
          {NAV.map((zone) => {
            const isActive = zone.id === active;
            return (
              <Box
                key={zone.id}
                component={Link}
                href={zone.href}
                aria-current={isActive ? "page" : undefined}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "100%",
                  color: "inherit",
                  textDecoration: "none",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 600 : 500,
                  opacity: isActive ? 1 : 0.72,
                  // Underline sits flush with the bar's bottom hairline. A
                  // matching transparent top border balances the box so the
                  // label stays optically centered in the 44px bar.
                  borderTop: "2px solid transparent",
                  borderBottom: "2px solid transparent",
                  borderBottomColor: isActive ? tint.accent : "transparent",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.15s ease, border-color 0.15s ease",
                  "&:hover": { opacity: 1 },
                }}
              >
                {zone.label}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
