"use client";

import NextLink from "next/link";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import ImageWithSpinner from "@/components/ImageWithSpinner";
import type { PostMeta } from "@/lib/blog";

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function metaLine(post: PostMeta): string {
  const parts: string[] = [];
  if (post.date) parts.push(formatDate(post.date));
  if (post.readingTime) parts.push(`${post.readingTime} min read`);
  return parts.join(" \u00b7 ");
}

function RelatedCard({ post, href }: { post: PostMeta; href: string }) {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      underline="none"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        height: "100%",
        color: "var(--article-text)",
        "&:hover .related-cover-img": { transform: "scale(1.04)" },
        "&:hover .related-title": { color: "var(--article-primary)" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: "var(--article-surface)",
          border: "1px solid var(--article-border)",
        }}
      >
        {post.cover && (
          <ImageWithSpinner
            className="related-cover-img"
            src={post.cover}
            alt=""
            spinnerColor="rgba(0,0,0,0.26)"
            containerSx={{ position: "absolute", inset: 0 }}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
          />
        )}
      </Box>
      <Typography
        className="related-title"
        component="h3"
        sx={{
          fontWeight: 700,
          fontSize: "1.05rem",
          lineHeight: 1.3,
          color: "var(--article-text)",
          transition: "color 0.2s ease",
        }}
      >
        {post.title}
      </Typography>
      {metaLine(post) && (
        <Typography sx={{ mt: "auto", fontSize: "0.82rem", color: "var(--article-muted)" }}>
          {metaLine(post)}
        </Typography>
      )}
    </MuiLink>
  );
}

export default function RelatedPosts({
  posts,
  basePath,
}: {
  posts: PostMeta[];
  basePath: string;
}) {
  if (!posts.length) return null;

  return (
    <Box
      component="aside"
      aria-label="Keep reading"
      sx={{
        maxWidth: 720,
        mx: "auto",
        mt: { xs: 6, md: 8 },
        pt: { xs: 4, md: 5 },
        borderTop: "1px solid var(--article-border)",
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: "0.8rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--article-muted)",
          mb: 3,
        }}
      >
        Keep reading
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: { xs: 3, sm: 4 },
        }}
      >
        {posts.map((post) => (
          <RelatedCard key={post.slug} post={post} href={`${basePath}/${post.slug}`} />
        ))}
      </Box>
    </Box>
  );
}
