import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import {
  Box,
  Typography,
  Chip,
  Stack as MuiStack,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import {
  ArticleThemeScope,
  Note,
  Quote,
  Stack,
  Image,
  Iframe,
  HtmlEmbed,
  Sidenote,
  Wide,
  FullWidth,
  HfUser,
  HfUserList,
  Accordion,
  Glossary,
  Video,
  TocDesktop,
  TocMobile,
} from "@/components/article";
import type { Author } from "@/lib/blog";

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

type Children = { children?: React.ReactNode };

// Author-facing components (usable in MDX without importing) plus the
// Markdown-element -> MUI mapping so posts inherit each zone's theme.
const components = {
  // Custom components
  Note,
  Quote,
  Stack,
  Image,
  Iframe,
  HtmlEmbed,
  Sidenote,
  Wide,
  FullWidth,
  HfUser,
  HfUserList,
  Accordion,
  Glossary,
  Video,

  // Markdown elements
  h1: ({ children }: Children) => (
    <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mt: 5, mb: 2, scrollMarginTop: "96px" }}>
      {children}
    </Typography>
  ),
  h2: ({ children, ...props }: Children) => (
    <Typography variant="h5" component="h2" {...props} sx={{ fontWeight: 700, mt: 5, mb: 1.5, scrollMarginTop: "96px" }}>
      {children}
    </Typography>
  ),
  h3: ({ children, ...props }: Children) => (
    <Typography variant="h6" component="h3" {...props} sx={{ fontWeight: 700, mt: 3.5, mb: 1, scrollMarginTop: "96px" }}>
      {children}
    </Typography>
  ),
  p: ({ children }: Children) => (
    <Typography sx={{ mb: 2, lineHeight: 1.75, color: "var(--article-text)" }}>{children}</Typography>
  ),
  a: ({ href, children }: Children & { href?: string }) => (
    <MuiLink href={href} underline="hover" sx={{ color: "var(--article-primary)" }}>
      {children}
    </MuiLink>
  ),
  ul: ({ children }: Children) => (
    <Box component="ul" sx={{ pl: 3, mb: 2, lineHeight: 1.75, color: "var(--article-text)" }}>
      {children}
    </Box>
  ),
  ol: ({ children }: Children) => (
    <Box component="ol" sx={{ pl: 3, mb: 2, lineHeight: 1.75, color: "var(--article-text)" }}>
      {children}
    </Box>
  ),
  li: ({ children }: Children) => <Box component="li" sx={{ mb: 0.5 }}>{children}</Box>,
  blockquote: ({ children }: Children) => (
    <Box
      component="blockquote"
      sx={{ my: 3, mx: 0, pl: 2.5, borderLeft: "2px solid var(--article-border)", color: "var(--article-muted)" }}
    >
      {children}
    </Box>
  ),
  hr: () => <Divider sx={{ my: 4 }} />,
  // Inline code. Block code (`pre > code`) is styled by rehype-pretty-code.
  code: ({ children, ...props }: Children) => {
    const isBlock = "data-language" in props || "data-theme" in props;
    if (isBlock) return <code {...props}>{children}</code>;
    return (
      <Box
        component="code"
        sx={{
          px: 0.6,
          py: 0.2,
          borderRadius: "4px",
          bgcolor: "var(--article-border)",
          fontSize: "0.88em",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {children}
      </Box>
    );
  },
  pre: ({ children, ...props }: Children) => (
    <Box
      component="pre"
      {...props}
      sx={{
        my: 3,
        p: 2,
        borderRadius: "8px",
        border: "1px solid var(--article-border)",
        overflowX: "auto",
        fontSize: "0.88rem",
        lineHeight: 1.6,
        "& code": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
      }}
    >
      {children}
    </Box>
  ),
  table: ({ children }: Children) => (
    <Box sx={{ overflowX: "auto", my: 3 }}>
      <Box
        component="table"
        sx={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: "0.92rem",
          border: "1px solid var(--article-border)",
          borderRadius: "8px",
          overflow: "hidden",
          "& th, & td": { borderBottom: "1px solid var(--article-border)", p: 1.2, textAlign: "left" },
          "& td + td, & th + th": { borderLeft: "1px solid var(--article-border)" },
          "& tr:last-of-type td": { borderBottom: "none" },
          "& th": { bgcolor: "var(--article-surface)", fontWeight: 700 },
        }}
      >
        {children}
      </Box>
    </Box>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => <Image src={src ?? ""} alt={alt} />,
};

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
  ],
} as const;

function AuthorLine({ authors, date, readingTime }: { authors: Author[]; date: string; readingTime: number }) {
  const parts: string[] = [];
  if (date) parts.push(formatDate(date));
  if (readingTime) parts.push(`${readingTime} min read`);

  return (
    <MuiStack
      direction="row"
      spacing={1}
      sx={{ alignItems: "center", flexWrap: "wrap", color: "var(--article-muted)", mb: 1 }}
    >
      {authors.length > 0 && (
        <Typography variant="body2" sx={{ color: "var(--article-text)", fontWeight: 600 }}>
          {authors.map((a, i) => (
            <span key={a.name}>
              {a.url ? (
                <MuiLink href={a.url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ color: "inherit" }}>
                  {a.name}
                </MuiLink>
              ) : (
                a.name
              )}
              {i < authors.length - 1 ? ", " : ""}
            </span>
          ))}
        </Typography>
      )}
      {parts.length > 0 && (
        <Typography variant="body2" sx={{ color: "var(--article-muted)" }}>
          {authors.length > 0 ? "\u00b7 " : ""}
          {parts.join(" \u00b7 ")}
        </Typography>
      )}
    </MuiStack>
  );
}

export default async function BlogPost({
  title,
  date,
  source,
  cover,
  authors = [],
  tags = [],
  readingTime = 0,
  hero,
}: {
  title: string;
  date: string;
  source: string;
  cover?: string;
  authors?: Author[];
  tags?: string[];
  readingTime?: number;
  hero?: React.ReactNode;
}) {
  const { content } = await compileMDX({
    source,
    components,
    options: { mdxOptions: mdxOptions as never },
  });

  return (
    <>
      {hero}
      <ArticleThemeScope>
        <Box
          sx={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "minmax(160px, 240px) minmax(0, 720px) minmax(160px, 240px)",
            },
            columnGap: { lg: 5 },
            maxWidth: { lg: 1280 },
            mx: "auto",
            py: { xs: 6, md: 10 },
            px: { xs: 2.5, sm: 3, lg: 0 },
          }}
        >
          {/* Left gutter: sticky Table of Contents (desktop only). */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <TocDesktop />
          </Box>

          <Box component="article" sx={{ minWidth: 0, width: "100%", maxWidth: 720, mx: "auto" }}>
            {/* When a hero (PageHero) is provided, the title + metadata live in
                that dark subheader, so the body starts straight at the content.
                Without a hero, render a full in-body article header. */}
            {!hero && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {title}
                </Typography>
                <AuthorLine authors={authors} date={date} readingTime={readingTime} />
                {tags.length > 0 && (
                  <MuiStack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                    {tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </MuiStack>
                )}
                {cover && (
                  <Box
                    component="img"
                    src={cover}
                    alt=""
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      mt: 3,
                    }}
                  />
                )}
              </Box>
            )}
            {content}
          </Box>

          {/* Right gutter: reserved for floating sidenotes (desktop only). */}
          <Box aria-hidden sx={{ display: { xs: "none", lg: "block" } }} />
        </Box>

        {/* Mobile: floating TOC toggle + slide-in sidebar. */}
        <TocMobile />
      </ArticleThemeScope>
    </>
  );
}
