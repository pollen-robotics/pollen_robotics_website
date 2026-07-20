import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogIndex from "@/components/BlogIndex";
import PageHero from "@/components/reachy/PageHero";
import { getAllPosts } from "@/lib/blog";
import { REACHY_BLOG_ENABLED } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Reachy Mini Blog",
  description: "News, deep dives and updates for Reachy Mini.",
  alternates: { canonical: "/reachy-mini/blog" },
};

export default function ReachyBlogPage() {
  if (!REACHY_BLOG_ENABLED) notFound();
  const posts = getAllPosts("reachy-mini");
  return (
    <BlogIndex
      title="Blog"
      basePath="/reachy-mini/blog"
      posts={posts}
      hero={
        <PageHero
          title="Blog"
          subtitle="News, deep dives and updates for Reachy Mini."
        />
      }
    />
  );
}
