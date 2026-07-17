import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/lib/blog";

// Emit a static sitemap.xml at build time (required by `output: export`).
export const dynamic = "force-static";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pollen-robotics.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // The Reachy Mini blog is temporarily disabled - excluded here.
  const staticRoutes = [
    "/",
    "/reachy-2",
    "/reachy-mini",
    "/blog",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));

  const pollenPosts = getPostSlugs("pollen").map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...pollenPosts];
}
