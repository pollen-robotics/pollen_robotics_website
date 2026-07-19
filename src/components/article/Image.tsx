"use client";

import { useState } from "react";
import { Box, Modal } from "@mui/material";

/**
 * Article image with caption, reserved aspect ratio (no layout shift) and
 * optional click-to-zoom. Usage in MDX:
 *   <Image src="/assets/blog/x.webp" alt="..." caption="..." width={1600} height={900} />
 */
export default function Image({
  src,
  alt = "",
  caption,
  width,
  height,
  zoom = true,
}: {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  zoom?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ratio = width && height ? `${width} / ${height}` : undefined;

  return (
    <Box component="figure" sx={{ my: 4, mx: 0 }}>
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        onClick={zoom ? () => setOpen(true) : undefined}
        sx={{
          display: "block",
          width: "100%",
          height: "auto",
          aspectRatio: ratio,
          borderRadius: "6px",
          cursor: zoom ? "zoom-in" : "default",
        }}
      />
      {caption && (
        <Box
          component="figcaption"
          sx={{
            mt: "6px",
            fontSize: "0.9rem",
            color: "var(--article-muted)",
            textAlign: "left",
          }}
        >
          {caption}
        </Box>
      )}

      {zoom && (
        <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition>
          <Box
            onClick={() => setOpen(false)}
            sx={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              bgcolor: "rgba(0, 0, 0, 0.85)",
              cursor: "zoom-out",
            }}
          >
            <Box
              component="img"
              src={src}
              alt={alt}
              sx={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 1 }}
            />
          </Box>
        </Modal>
      )}
    </Box>
  );
}
