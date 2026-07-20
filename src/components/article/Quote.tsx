import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

/**
 * Pull quote with a large, faint decorative quotation mark and an em-dash
 * attribution, matching the article template. Usage:
 *   <Quote author="Ada Lovelace" source="1843">...</Quote>
 */
export default function Quote({
  children,
  author,
  source,
}: {
  children?: ReactNode;
  author?: string;
  source?: string;
}) {
  return (
    <Box
      component="blockquote"
      sx={{
        position: "relative",
        my: 4,
        mx: 0,
        p: 0,
        border: "none",
        maxWidth: 600,
        "&::before": {
          content: '"\\201C"',
          position: "absolute",
          top: "-24px",
          left: "-30px",
          fontSize: "8rem",
          lineHeight: 1,
          color: "var(--article-text)",
          opacity: 0.05,
          zIndex: -1,
          pointerEvents: "none",
        },
      }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: "1.5rem",
          lineHeight: 1.4,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "var(--article-text)",
          mb: "12px",
          "& p": { m: 0 },
        }}
      >
        {children}
      </Typography>
      {(author || source) && (
        <Box
          component="footer"
          sx={{
            fontSize: "0.875rem",
            color: "var(--article-muted)",
            display: "flex",
            gap: "6px",
          }}
        >
          {author && (
            <Box component="span" sx={{ fontStyle: "italic", opacity: 0.85, color: "var(--article-text)" }}>
              {"\u2014 "}
              {author}
            </Box>
          )}
          {author && source && <span>, </span>}
          {source && (
            <Box component="span" sx={{ fontStyle: "italic", opacity: 0.85, color: "var(--article-text)" }}>
              {source}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
