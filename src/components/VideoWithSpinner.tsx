"use client";

import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type VideoSource = { src: string; type?: string };

/**
 * A <video> with a loading spinner shown behind it until the first frame is
 * decoded (or the source errors). Mirrors ImageWithSpinner: the spinner sits
 * under the (transparent-until-loaded) video, so once the first frame paints it
 * simply covers the spinner - no opacity animation that would clash with hover
 * or parallax transforms on the video.
 *
 * - `sx` is forwarded to the <video> (keep the call site's objectFit/position).
 * - `containerSx` sizes the wrapper; for a parent that already sizes the media
 *   pass `{ width: "100%", height: "100%" }` (or `{ position: "absolute", inset: 0 }`).
 * - `src` may be a single URL (rendered as one <source>) or a list of sources.
 */
export default function VideoWithSpinner({
  src,
  poster,
  autoPlay,
  muted = true,
  loop,
  playsInline,
  controls,
  preload,
  "aria-label": ariaLabel,
  sx,
  containerSx,
  spinnerSize = 26,
  spinnerColor = "rgba(255,255,255,0.5)",
}: {
  src: string | VideoSource[];
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: "auto" | "metadata" | "none";
  "aria-label"?: string;
  sx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
  spinnerSize?: number;
  spinnerColor?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // React sets `muted` as an attribute, which browsers ignore for the autoplay
  // policy; set it on the property so muted autoplay is honored. Also covers the
  // case where the first frame is already available before React attaches
  // onLoadedData (e.g. cached video).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (muted) el.muted = true;
    if (el.readyState >= 2) setLoaded(true);
  }, [muted]);

  const sources: VideoSource[] =
    typeof src === "string" ? [{ src, type: "video/mp4" }] : src;

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
        component="video"
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        preload={preload}
        aria-label={ariaLabel}
        onLoadedData={() => setLoaded(true)}
        onError={() => setErrored(true)}
        sx={{ position: "relative", zIndex: 1, ...sx }}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type ?? "video/mp4"} />
        ))}
      </Box>
    </Box>
  );
}
