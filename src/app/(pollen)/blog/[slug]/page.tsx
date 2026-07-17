import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "@/components/BlogPost";
import { getPost, getPostSlugs } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs("pollen").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("pollen", slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function PollenBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("pollen", slug);
  if (!post) notFound();
  return <BlogPost title={post.title} date={post.date} source={post.content} />;
}
