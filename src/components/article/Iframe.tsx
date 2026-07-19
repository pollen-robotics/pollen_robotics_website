"use client";

import { Box, Typography } from "@mui/material";

/**
 * Responsive wrapper for embedding external interactive content: Hugging Face
 * Spaces, live demos, dashboards, etc. Provide either a fixed `height` or an
 * aspect `ratio` (e.g. "16 / 9"). Usage in MDX:
 *   <Iframe src="https://huggingface.co/spaces/..." title="Demo" height={520} />
 */
export default function Iframe({
  src,
  title,
  height,
  ratio,
  caption,
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
}: {
  src: string;
  title: string;
  height?: number;
  ratio?: string;
  caption?: string;
  allow?: string;
}) {
  const useRatio = !height && (ratio ?? "16 / 9");

  return (
    <Box component="figure" sx={{ my: 4, mx: 0 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: height ? `${height}px` : undefined,
          aspectRatio: useRatio || undefined,
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--article-border)",
          bgcolor: "var(--article-surface)",
        }}
      >
        <Box
          component="iframe"
          src={src}
          title={title}
          loading="lazy"
          allow={allow}
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </Box>
      {caption && (
        <Typography
          component="figcaption"
          sx={{ mt: "6px", fontSize: "0.9rem", color: "var(--article-muted)", textAlign: "left" }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
}
