import type { ReactNode } from "react";
import { Box } from "@mui/material";

/**
 * Collapsible section built on native <details>/<summary> (no JS needed, works
 * in static export). Usage: <Accordion title="Details">...</Accordion>
 */
export default function Accordion({
  title,
  open = false,
  children,
}: {
  title?: string;
  open?: boolean;
  children?: ReactNode;
}) {
  return (
    <Box
      component="details"
      open={open}
      sx={{
        my: 3,
        border: "1px solid var(--article-border)",
        borderRadius: "8px",
        bgcolor: "var(--article-surface)",
        overflow: "hidden",
        "& > summary": {
          listStyle: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 2,
          py: 1.5,
          fontWeight: 600,
          color: "var(--article-text)",
          userSelect: "none",
        },
        "& > summary::-webkit-details-marker": { display: "none" },
        "& > summary::after": {
          content: '"\\203A"',
          fontSize: "1.4em",
          lineHeight: 1,
          transform: "rotate(90deg)",
          transition: "transform 0.2s ease",
          opacity: 0.6,
        },
        "&[open] > summary::after": { transform: "rotate(-90deg)" },
        "&[open] > summary": { borderBottom: "1px solid var(--article-border)" },
        "& .accordion__body": { p: 2, color: "var(--article-text)" },
        "& .accordion__body > :first-of-type": { mt: 0 },
        "& .accordion__body > :last-child": { mb: 0 },
      }}
    >
      <Box component="summary">{title}</Box>
      <Box className="accordion__body">{children}</Box>
    </Box>
  );
}
