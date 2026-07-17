import { notFound } from "next/navigation";

export const dynamicParams = false;

// Reachy Mini blog temporarily disabled. `output: export` requires a dynamic
// route to declare at least one param, so we emit a single throwaway slug that
// itself 404s; every other slug 404s too (dynamicParams = false). Restore the
// implementation below to re-enable blog posts.
export function generateStaticParams() {
  return [{ slug: "disabled" }];
}

export default function ReachyBlogPostPage() {
  notFound();
}

/* ----------------------------------------------------------------------------
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "@/components/BlogPost";
import PageHero from "@/components/reachy/PageHero";
import { getPost, getPostSlugs } from "@/lib/blog";

export const dynamicParams = false;

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

export function generateStaticParams() {
  return getPostSlugs("reachy-mini").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("reachy-mini", slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/reachy-mini/blog/${slug}` },
  };
}

export default async function ReachyBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("reachy-mini", slug);
  if (!post) notFound();
  return (
    <BlogPost
      title={post.title}
      date={post.date}
      source={post.content}
      hero={
        <PageHero
          eyebrow="Blog"
          title={post.title}
          subtitle={formatDate(post.date)}
        />
      }
    />
  );
}
---------------------------------------------------------------------------- */
