import type { ReactNode } from "react";
import { Box } from "@mui/material";

/**
 * Breaks a block out of the text column up to ~1100px, centered on the
 * viewport. Collapses to full container width below 1100px. Mirrors the
 * research-article-template `.wide` helper.
 */
export function Wide({ children }: { children?: ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        my: 4,
        width: "min(1100px, 100vw - 48px)",
        ml: "50%",
        transform: "translateX(-50%)",
        "& > *": { mb: 0 },
        "@media (max-width:1100px)": { width: "100%", ml: 0, transform: "none" },
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Spans the full viewport width, centered on the viewport. Mirrors the
 * research-article-template `.full-width` helper.
 */
export function FullWidth({ children }: { children?: ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        my: 4,
        width: "100vw",
        ml: "calc(50% - 50vw)",
        mr: "calc(50% - 50vw)",
        "& > *": { mb: 0 },
      }}
    >
      {children}
    </Box>
  );
}
