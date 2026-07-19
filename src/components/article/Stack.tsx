import type { ReactNode } from "react";
import { Box } from "@mui/material";

// Accepts both the pollen shorthand ("2-col") and the research-article-template
// naming ("2-column", "auto") so ported articles work verbatim.
type Layout =
  | "2-col"
  | "3-col"
  | "4-col"
  | "2-column"
  | "3-column"
  | "4-column"
  | "auto";

const COLUMNS: Record<string, number> = {
  "2-col": 2,
  "3-col": 3,
  "4-col": 4,
  "2-column": 2,
  "3-column": 3,
  "4-column": 4,
};

const GAP: Record<string, number> = {
  small: 1.5,
  medium: 2.5,
  large: 4,
};

/**
 * Side-by-side columns that collapse to a single column on small screens.
 * Usage in MDX:
 *   <Stack layout="2-column" gap="medium"> ...items... </Stack>
 * layout="auto" fits as many equal columns as children.
 */
export default function Stack({
  children,
  layout = "2-col",
  gap = "medium",
}: {
  children?: ReactNode;
  layout?: Layout;
  gap?: number | "small" | "medium" | "large";
}) {
  const cols = COLUMNS[layout] ?? 2;
  const gapValue = typeof gap === "number" ? gap : GAP[gap] ?? 2.5;
  const templateColumns =
    layout === "auto"
      ? { xs: "1fr", sm: "repeat(auto-fit, minmax(220px, 1fr))" }
      : { xs: "1fr", sm: `repeat(${cols}, 1fr)` };

  return (
    <Box
      sx={{
        my: 3,
        display: "grid",
        gridTemplateColumns: templateColumns,
        gap: gapValue,
        alignItems: "start",
        "& > * ": { m: 0 },
      }}
    >
      {children}
    </Box>
  );
}
