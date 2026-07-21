"use client";

import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

/**
 * An <img> with a loading spinner shown behind it until the image loads (or
 * errors). The spinner sits under the image, so once the (opaque) photo is
 * decoded it simply covers the spinner - no opacity animation that would clash
 * with hover transforms on the image.
 *
 * - `sx` is forwarded to the <img> (keep the call site's objectFit/position).
 * - `containerSx` sizes the wrapper; for a parent that already sizes the image
 *   pass `{ width: "100%", height: "100%" }` (or `{ position: "absolute", inset: 0 }`).
 */
export default function ImageWithSpinner({
  src,
  alt = "",
  sx,
  containerSx,
  spinnerSize = 26,
  spinnerColor = "rgba(255,255,255,0.5)",
  className,
  onClick,
  loading = "lazy",
}: {
  src: string;
  alt?: string;
  sx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
  spinnerSize?: number;
  spinnerColor?: string;
  className?: string;
  onClick?: () => void;
  loading?: "lazy" | "eager";
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...containerSx,
      }}
    >
      {!loaded && !errored && (
        <CircularProgress
          size={spinnerSize}
          thickness={4}
          sx={{ position: "absolute", zIndex: 0, color: spinnerColor }}
        />
      )}
      <Box
        component="img"
        className={className}
        src={src}
        alt={alt}
        loading={loading}
        onClick={onClick}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        sx={{ position: "relative", zIndex: 1, ...sx }}
      />
    </Box>
  );
}
