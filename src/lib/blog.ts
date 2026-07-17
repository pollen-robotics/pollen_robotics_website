import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Blog content lives as MDX files, one folder per zone:
//   src/content/<zone>/blog/*.mdx
// where <zone> is the URL-facing zone id ("pollen" -> "/blog",
// "reachy-mini" -> "/reachy-mini/blog"). Posts are fully static: read at build
// time, prerendered to HTML, and never touched at runtime (dynamicParams=false).

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export type BlogZone = "pollen" | "reachy-mini";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function blogDir(zone: BlogZone): string {
  return path.join(CONTENT_DIR, zone, "blog");
}

export function getPostSlugs(zone: BlogZone): string[] {
  const dir = blogDir(zone);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(zone: BlogZone, slug: string): Post | null {
  const file = path.join(blogDir(zone), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    content,
  };
}

export function getAllPosts(zone: BlogZone): PostMeta[] {
  return getPostSlugs(zone)
    .map((slug) => {
      const post = getPost(zone, slug);
      if (!post) return null;
      const { content: _content, ...meta } = post;
      void _content;
      return meta;
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
