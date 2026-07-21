"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { Box, Container, Typography, Chip, Stack, Link as MuiLink } from "@mui/material";
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

function Cover({ src, ratio = "16 / 9" }: { src?: string; ratio?: string }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "action.hover",
      }}
    >
      {src && (
        <ImageWithSpinner
          className="cover-img"
          src={src}
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
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={{
            height: 24,
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "primary.main",
            bgcolor: "transparent",
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      ))}
    </Stack>
  );
}

function cardLinkSx() {
  return {
    color: "text.primary",
    display: "block",
    height: "100%",
    "&:hover .cover-img": { transform: "scale(1.04)" },
    "&:hover .card-title": { color: "primary.main" },
  } as const;
}

function FeaturedCard({ post, href }: { post: PostMeta; href: string }) {
  return (
    <MuiLink component={NextLink} href={href} underline="none" sx={cardLinkSx()}>
      <Box
        component="article"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
          gap: { xs: 2.5, md: 5 },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            borderRadius: "12px",
            overflow: "hidden",
            bgcolor: "action.hover",
          }}
        >
          {post.cover && (
            <ImageWithSpinner
              className="cover-img"
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Tags tags={post.tags} />
          <Typography
            className="card-title"
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.15,
              transition: "color 0.2s ease",
              fontSize: { xs: "1.6rem", md: "2rem" },
            }}
          >
            {post.title}
          </Typography>
          {post.description && (
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.description}
            </Typography>
          )}
          {metaLine(post) && (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {metaLine(post)}
            </Typography>
          )}
        </Box>
      </Box>
    </MuiLink>
  );
}

function Card({ post, href }: { post: PostMeta; href: string }) {
  return (
    <MuiLink component={NextLink} href={href} underline="none" sx={cardLinkSx()}>
      <Box
        component="article"
        sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: "100%" }}
      >
        <Cover src={post.cover} />
        <Tags tags={post.tags} />
        <Typography
          className="card-title"
          variant="h6"
          component="h3"
          sx={{ fontWeight: 700, lineHeight: 1.25, transition: "color 0.2s ease" }}
        >
          {post.title}
        </Typography>
        {post.description && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.description}
          </Typography>
        )}
        {metaLine(post) && (
          <Typography variant="caption" sx={{ color: "text.secondary", mt: "auto", pt: 0.5 }}>
            {metaLine(post)}
          </Typography>
        )}
      </Box>
    </MuiLink>
  );
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
  const [featured, ...rest] = posts;

  return (
    <>
      {hero}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        {!hero && (
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 5 }}>
            {title}
          </Typography>
        )}

        {posts.length === 0 ? (
          <Typography sx={{ color: "text.secondary" }}>No posts yet.</Typography>
        ) : (
          <>
            {featured && (
              <Box sx={{ mb: { xs: 6, md: 8 } }}>
                <FeaturedCard post={featured} href={`${basePath}/${featured.slug}`} />
              </Box>
            )}

            {rest.length > 0 && (
              <>
                <Box
                  sx={{
                    height: "1px",
                    bgcolor: "divider",
                    mb: { xs: 5, md: 6 },
                  }}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    columnGap: 4,
                    rowGap: { xs: 5, md: 6 },
                  }}
                >
                  {rest.map((post) => (
                    <Card key={post.slug} post={post} href={`${basePath}/${post.slug}`} />
                  ))}
                </Box>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}
