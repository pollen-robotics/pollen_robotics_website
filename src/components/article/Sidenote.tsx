import type { ReactNode } from "react";
import { Box } from "@mui/material";

/**
 * Margin note. On wide screens (>= 1280px) it floats into the right gutter
 * beside the body text; below that it collapses to an inline muted aside with a
 * thin left rule. Usage in MDX: <Sidenote>Extra context.</Sidenote>
 */
export default function Sidenote({ children }: { children?: ReactNode }) {
  return (
    <Box
      component="aside"
      sx={{
        display: "block",
        my: 2,
        pl: 2,
        borderLeft: "2px solid var(--article-border)",
        fontSize: "0.85rem",
        lineHeight: 1.55,
        color: "var(--article-muted)",
        "& > :first-of-type": { mt: 0 },
        "& > :last-child": { mb: 0 },
        "@media (min-width:1280px)": {
          float: "right",
          clear: "right",
          width: 248,
          ml: 4,
          mr: "-288px",
          my: 1,
          pl: 0,
          borderLeft: "none",
        },
      }}
    >
      {children}
    </Box>
  );
}
