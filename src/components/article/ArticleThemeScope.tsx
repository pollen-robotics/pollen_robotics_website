"use client";

import type { ReactNode } from "react";
import { Box, useTheme } from "@mui/material";

/**
 * Bridges the active zone's MUI theme to plain CSS custom properties, scoped to
 * the article subtree. Author components and self-contained HTML/D3 embeds read
 * these variables (via the CSS cascade) instead of depending on MUI, so they
 * stay theme-aware without a global refactor and without a dark-mode switch.
 */
export default function ArticleThemeScope({ children }: { children: ReactNode }) {
  const t = useTheme();

  return (
    <Box
      className="article-root"
      sx={{
        "--article-text": t.palette.text.primary,
        "--article-muted": t.palette.text.secondary,
        "--article-surface": t.palette.background.paper,
        "--article-page": t.palette.background.default,
        "--article-border": t.palette.divider,
        "--article-primary": t.palette.primary.main,
        // Chart-oriented aliases so embeds can style axes/grids directly.
        "--article-axis": t.palette.text.secondary,
        "--article-tick": t.palette.text.secondary,
        "--article-grid": t.palette.divider,
        // research-article-template variable names, so embeds and raw HTML
        // ported from those articles resolve their colors unchanged.
        "--primary-color": t.palette.primary.main,
        "--text-color": t.palette.text.primary,
        "--muted-color": t.palette.text.secondary,
        "--border-color": t.palette.divider,
        "--surface-bg": t.palette.background.paper,
        "--page-bg": t.palette.background.default,
      }}
    >
      {children}
    </Box>
  );
}
