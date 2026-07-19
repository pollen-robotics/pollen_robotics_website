import type { ReactNode } from "react";
import { Box } from "@mui/material";

/**
 * Inline glossary term: renders its children with a dotted underline and a
 * native tooltip carrying the definition. Usage:
 *   <Glossary term="WebRTC" definition="...">WebRTC</Glossary>
 */
export default function Glossary({
  definition,
  children,
}: {
  term?: string;
  definition?: string;
  children?: ReactNode;
}) {
  return (
    <Box
      component="abbr"
      title={definition}
      sx={{
        textDecoration: "none",
        borderBottom: "1px dotted var(--article-muted)",
        cursor: "help",
      }}
    >
      {children}
    </Box>
  );
}
