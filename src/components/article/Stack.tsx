import { Children, type ReactNode } from "react";
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
 *
 * matchHeight mode lays the children out in a centered row where every video is
 * forced to the same height (`height`, px, on sm+), keeping each one's own
 * aspect ratio - so a portrait phone clip naturally takes less width than a
 * landscape desktop clip, and the two line up on a shared baseline without any
 * distortion. On small screens the row wraps and each video goes full width.
 */
export default function Stack({
  children,
  layout = "2-col",
  gap = "medium",
  matchHeight = false,
  rowHeight = 360,
  cover = false,
  ratio,
}: {
  children?: ReactNode;
  layout?: Layout;
  gap?: number | "small" | "medium" | "large";
  matchHeight?: boolean;
  // Accept a string too: MDX drops numeric expression attributes ({320}) in
  // this pipeline, so authors pass rowHeight="320" and we coerce here.
  rowHeight?: number | string;
  // cover: keep the fixed equal-width columns (e.g. 50/50) but force every
  // video to the same shape via a shared `ratio` and object-fit:cover, so the
  // row always lines up on one height whatever each clip's own ratio is (it is
  // cropped, never distorted). Stays responsive - the shared aspect-ratio, not
  // a pixel height, drives the row.
  cover?: boolean;
  ratio?: string;
}) {
  const cols = COLUMNS[layout] ?? 2;
  const gapValue = typeof gap === "number" ? gap : GAP[gap] ?? 2.5;
  const rowHeightPx = Number(rowHeight) || 360;

  // Equal-height row: videos share one height on sm+, width follows their own
  // ratio (so portrait clips are narrower than landscape ones), full width on xs.
  if (matchHeight) {
    return (
      <Box
        sx={{
          my: 3,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: gapValue,
          "& > *": { m: 0 },
          "& figure": {
            m: 0,
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          "& video": {
            height: { xs: "auto", sm: `${rowHeightPx}px` },
            width: { xs: "100%", sm: "auto" },
            maxWidth: "100%",
          },
          // The caption must not widen the figure past the video: a long line
          // would blow up the flex item and force the row to wrap. width:0 keeps
          // it out of the figure's intrinsic width, minWidth:100% then wraps it
          // to the video's width.
          "& figcaption": {
            width: 0,
            minWidth: "100%",
          },
        }}
      >
        {children}
      </Box>
    );
  }

  // A single child in a fixed-column layout is centered at one column's width,
  // rather than pinned to the left column (which reads as misaligned). This lets
  // e.g. a lone portrait video sit at 50% width, centered. "auto" is unaffected.
  if (layout !== "auto" && Children.count(children) === 1) {
    return (
      <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: { xs: "100%", sm: `${100 / cols}%` }, "& > *": { m: 0 } }}>
          {children}
        </Box>
      </Box>
    );
  }

  const templateColumns =
    layout === "auto"
      ? { xs: "1fr", sm: "repeat(auto-fit, minmax(220px, 1fr))" }
      : { xs: "1fr", sm: `repeat(${cols}, 1fr)` };

  const coverSx = cover
    ? {
        "& video": {
          width: "100%",
          height: "auto",
          maxWidth: "none",
          aspectRatio: ratio ? ratio.replace("/", " / ") : undefined,
          objectFit: "cover",
        },
      }
    : undefined;

  return (
    <Box
      sx={{
        my: 3,
        display: "grid",
        gridTemplateColumns: templateColumns,
        gap: gapValue,
        alignItems: "start",
        "& > * ": { m: 0 },
        ...coverSx,
      }}
    >
      {children}
    </Box>
  );
}
