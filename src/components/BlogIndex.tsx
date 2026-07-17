"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import type { PostMeta } from "@/lib/blog";

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {posts.map((post) => (
              <Box key={post.slug} component="article">
                <MuiLink
                  component={NextLink}
                  href={`${basePath}/${post.slug}`}
                  underline="none"
                  sx={{ color: "text.primary" }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {post.title}
                  </Typography>
                </MuiLink>
                {post.date && (
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    {formatDate(post.date)}
                  </Typography>
                )}
                {post.description && (
                  <Typography sx={{ color: "text.secondary" }}>
                    {post.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
