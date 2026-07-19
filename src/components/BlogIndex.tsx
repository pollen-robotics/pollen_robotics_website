"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { Box, Container, Typography, Chip, Stack, Link as MuiLink } from "@mui/material";
import type { PostMeta } from "@/lib/blog";

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function meta(post: PostMeta): string {
  const parts: string[] = [];
  if (post.date) parts.push(formatDate(post.date));
  if (post.readingTime) parts.push(`${post.readingTime} min read`);
  return parts.join(" \u00b7 ");
}

export default function BlogIndex({
  title,
  basePath,
  posts,
  hero,
}: {
  title: string;
  basePath: string;
  posts: PostMeta[];
  hero?: ReactNode;
}) {
  return (
    <>
      {hero}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        {!hero && (
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
            {title}
          </Typography>
        )}

        {posts.length === 0 ? (
          <Typography sx={{ color: "text.secondary" }}>No posts yet.</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {posts.map((post) => (
              <MuiLink
                key={post.slug}
                component={NextLink}
                href={`${basePath}/${post.slug}`}
                underline="none"
                sx={{
                  color: "text.primary",
                  display: "block",
                  borderRadius: "8px",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                  "&:hover .blog-card-title": { color: "primary.main" },
                }}
              >
                <Box component="article">
                  {post.cover && (
                    <Box
                      component="img"
                      src={post.cover}
                      alt=""
                      loading="lazy"
                      sx={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        aspectRatio: "16 / 9",
                        objectFit: "cover",
                        borderRadius: "8px",
                        mb: 2,
                      }}
                    />
                  )}
                  {post.tags.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 1 }}>
                      {post.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  )}
                  <Typography
                    className="blog-card-title"
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 0.5, transition: "color 0.2s ease" }}
                  >
                    {post.title}
                  </Typography>
                  {meta(post) && (
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                      {meta(post)}
                    </Typography>
                  )}
                  {post.description && (
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                      {post.description}
                    </Typography>
                  )}
                </Box>
              </MuiLink>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
