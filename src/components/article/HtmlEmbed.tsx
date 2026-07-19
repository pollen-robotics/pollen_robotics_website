"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

// Load the color palette helper once per page, before any embed script runs.
function ensureColorPalettes(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as { __colorPalettesLoading?: Promise<void>; ColorPalettes?: unknown };
  if (w.ColorPalettes) return Promise.resolve();
  if (w.__colorPalettesLoading) return w.__colorPalettesLoading;

  w.__colorPalettesLoading = new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>("#color-palettes-script");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const s = document.createElement("script");
    s.id = "color-palettes-script";
    s.src = "/scripts/color-palettes.js";
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
  return w.__colorPalettesLoading;
}

// innerHTML does not execute <script> tags, so recreate each one to run it.
function runScripts(root: HTMLElement) {
  const scripts = Array.from(root.querySelectorAll("script"));
  for (const old of scripts) {
    const s = document.createElement("script");
    for (const attr of Array.from(old.attributes)) s.setAttribute(attr.name, attr.value);
    s.textContent = old.textContent;
    old.replaceWith(s);
  }
}

/**
 * Injects a self-contained HTML/D3 visualization from `public/embeds/<src>` and
 * runs its scripts once the embed scrolls into view. Colors come from
 * `window.ColorPalettes`; theming from the `--article-*` CSS variables.
 * Usage in MDX:
 *   <HtmlEmbed src="d3-example.html" title="..." caption="..." />
 */
export default function HtmlEmbed({
  src,
  title,
  caption,
  frameless = false,
}: {
  src: string;
  title?: string;
  caption?: string;
  frameless?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || mounted) return;

    let cancelled = false;
    const load = async () => {
      try {
        await ensureColorPalettes();
        const res = await fetch(`/embeds/${src}`, { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        if (cancelled) return;
        host.innerHTML = html;
        runScripts(host);
        setMounted(true);
      } catch (e) {
        if (!cancelled) setError(`Failed to load embed "${src}": ${(e as Error).message}`);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "150px" }
    );
    io.observe(host);

    // Fallback in case the observer never fires (e.g. printing).
    const fallback = window.setTimeout(() => {
      io.disconnect();
      load();
    }, 3000);

    return () => {
      cancelled = true;
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [src, mounted]);

  return (
    <Box component="figure" sx={{ my: 4, mx: 0 }}>
      {title && (
        <Typography sx={{ fontWeight: 700, mb: 1, color: "var(--article-text)", fontSize: "1rem" }}>
          {title}
        </Typography>
      )}
      <Box
        sx={
          frameless
            ? { minHeight: 80 }
            : {
                p: 2,
                borderRadius: "8px",
                border: "1px solid var(--article-border)",
                bgcolor: "var(--article-surface)",
                minHeight: 120,
              }
        }
      >
        {error ? (
          <Box component="pre" sx={{ color: "#ef4444", whiteSpace: "pre-wrap", m: 0, fontSize: "0.85rem" }}>
            {error}
          </Box>
        ) : (
          <div ref={hostRef} data-embed-src={src} />
        )}
      </Box>
      {caption && (
        <Typography
          component="figcaption"
          sx={{ mt: "6px", fontSize: "0.9rem", color: "var(--article-muted)", textAlign: "left" }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
}
