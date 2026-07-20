import type { ReactNode } from "react";
import { Box } from "@mui/material";

/**
 * Self-hosted video with an optional caption. Replaces the raw <video>/<figure>
 * blocks from the research-article-template (which relied on inline style
 * strings that React MDX cannot parse). Usage:
 *   <Video src="/videos/x.mp4" aspect="16/10">Caption</Video>
 *   <Video src="/videos/phone.mp4" aspect="1002/1720" maxWidth={300}>Caption</Video>
 */
export default function Video({
  src,
  aspect,
  maxWidth,
  loop = false,
  children,
}: {
  src: string;
  aspect?: string;
  maxWidth?: number;
  // When true, behaves like an animated GIF: autoplay, muted, looping, no
  // controls. Otherwise a standard video with playback controls.
  loop?: boolean;
  children?: ReactNode;
}) {
  const gifLike = loop
    ? { autoPlay: true, loop: true, muted: true, controls: false }
    : { controls: true };
  return (
    <Box component="figure" sx={{ m: 0, my: 3 }}>
      <Box
        component="video"
        {...gifLike}
        playsInline
        preload="metadata"
        sx={{
          display: "block",
          mx: "auto",
          width: "100%",
          maxWidth: maxWidth ? `${maxWidth}px` : "100%",
          aspectRatio: aspect ? aspect.replace("/", " / ") : undefined,
          objectFit: "contain",
          borderRadius: "10px",
          background: "#000",
        }}
      >
        <source src={src} type="video/mp4" />
      </Box>
      {children && (
        <Box
          component="figcaption"
          sx={{
            mt: "10px",
            fontSize: "0.9rem",
            color: "var(--article-muted)",
            textAlign: "center",
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}
