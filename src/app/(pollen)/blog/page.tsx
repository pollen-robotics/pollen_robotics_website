import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "News and updates from Pollen Robotics.",
  alternates: { canonical: "/blog" },
};

export default function PollenBlogPage() {
  const posts = getAllPosts("pollen");
  return <BlogIndex title="Blog" basePath="/blog" posts={posts} />;
}
