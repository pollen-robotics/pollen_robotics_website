import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import PageHero from "@/components/reachy/PageHero";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Reachy Mini Blog",
  description: "News, deep dives and updates for Reachy Mini.",
  alternates: { canonical: "/reachy-mini/blog" },
};

export default function ReachyBlogPage() {
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
