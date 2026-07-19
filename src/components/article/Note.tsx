import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type Variant = "neutral" | "info" | "success" | "warning" | "danger";

// Accent per variant (matches the research-article-template palette). The
// background is a subtle tint of the accent over the article surface.
const ACCENTS: Record<Variant, string | null> = {
  neutral: null,
  info: "#f39c12",
  success: "#2ecc71",
  warning: "#f39c12",
  danger: "#e74c3c",
};

/**
 * Callout box for tips, warnings, and asides. Thin left accent border with the
 * top/bottom-right corners rounded, matching the article template. Usage:
 *   <Note variant="info" title="Heads up">...</Note>
 */
export default function Note({
  children,
  variant = "neutral",
  title,
  emoji,
}: {
  children?: ReactNode;
  variant?: Variant;
  title?: string;
  emoji?: string;
}) {
  const accent = ACCENTS[variant] ?? null;
  const borderColor = accent ?? "var(--article-border)";
  const bg = accent
    ? `color-mix(in oklab, ${accent} 9%, var(--article-surface))`
    : "var(--article-surface)";

  return (
    <Box
      sx={{
        my: 3,
        px: "18px",
        py: "20px",
        bgcolor: bg,
        borderLeft: `2px solid ${borderColor}`,
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      {emoji && (
        <Box aria-hidden sx={{ fontSize: "20px", lineHeight: 1.4, flexShrink: 0 }}>
          {emoji}
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: "1 1 auto" }}>
        {title && (
          <Typography
            sx={{
              fontWeight: 600,
              mb: "6px",
              color: "var(--article-text)",
              fontSize: "16px",
              letterSpacing: "0.2px",
            }}
          >
            {title}
          </Typography>
        )}
        <Box
          sx={{
            color: "var(--article-text)",
            fontSize: "0.95rem",
            lineHeight: 1.65,
            "& > :first-of-type": { mt: 0 },
            "& > :last-child": { mb: 0 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
