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
  const url = `/blog/${slug}`;
  const images = post.cover ? [{ url: post.cover }] : undefined;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      images,
      publishedTime: post.date || undefined,
      authors: post.authors.map((a) => a.name),
      tags: post.tags,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pollen-robotics.com";

export default async function PollenBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("pollen", slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.date || undefined,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    author: post.authors.map((a) => ({
      "@type": "Person",
      name: a.name,
      url: a.url,
    })),
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Pollen Robotics",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost
        title={post.title}
        date={post.date}
        source={post.content}
        cover={post.cover}
        authors={post.authors}
        tags={post.tags}
        readingTime={post.readingTime}
      />
    </>
  );
}
