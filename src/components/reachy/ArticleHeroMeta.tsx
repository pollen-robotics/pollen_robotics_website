import { Box, Link as MuiLink, Typography } from "@mui/material";
import type { Author } from "@/lib/blog";

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Article metadata rendered inside the dark PageHero (white on dark): author
 * names, publication date and reading time. Mirrors the research article
 * template's header, tuned for the Reachy blog subheader.
 */
export default function ArticleHeroMeta({
  authors = [],
  date,
  readingTime = 0,
}: {
  authors?: Author[];
  date?: string;
  readingTime?: number;
}) {
  const secondary: string[] = [];
  if (date) secondary.push(formatDate(date));
  if (readingTime) secondary.push(`${readingTime} min read`);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="body2"
        sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}
      >
        {authors.length > 0 && (
          <Box component="span" sx={{ color: "white", fontWeight: 600 }}>
            {authors.map((a, i) => (
              <Box component="span" key={a.name}>
                {a.url ? (
                  <MuiLink
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: "inherit" }}
                  >
                    {a.name}
                  </MuiLink>
                ) : (
                  a.name
                )}
                {i < authors.length - 1 ? ", " : ""}
              </Box>
            ))}
          </Box>
        )}
        {secondary.length > 0 && (
          <Box component="span" sx={{ color: "rgba(255,255,255,0.6)" }}>
            {authors.length > 0 ? "  \u00b7  " : ""}
            {secondary.join("  \u00b7  ")}
          </Box>
        )}
      </Typography>
    </Box>
  );
}
