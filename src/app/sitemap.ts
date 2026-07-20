import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/lib/blog";
import { REACHY_BLOG_ENABLED } from "@/lib/flags";

// Emit a static sitemap.xml at build time (required by `output: export`).
export const dynamic = "force-static";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pollen-robotics.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/reachy-2",
    "/reachy-mini",
    ...(REACHY_BLOG_ENABLED ? ["/reachy-mini/blog"] : []),
    "/blog",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));

  const pollenPosts = getPostSlugs("pollen").map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
  }));

  const reachyPosts = REACHY_BLOG_ENABLED
    ? getPostSlugs("reachy-mini").map((slug) => ({
        url: `${SITE_URL}/reachy-mini/blog/${slug}`,
        lastModified: now,
      }))
    : [];

  return [...staticRoutes, ...pollenPosts, ...reachyPosts];
}
