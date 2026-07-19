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

export interface Author {
  name: string;
  url?: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  cover?: string;
  authors: Author[];
  tags: string[];
  readingTime: number;
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

// Frontmatter is intentionally forgiving: authors may be a plain string, an
// array of strings, or an array of { name, url }. Normalize everything to
// Author[] so consumers never branch on shape.
function normalizeAuthors(raw: unknown): Author[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map((a): Author | null => {
      if (typeof a === "string") return { name: a };
      if (a && typeof a === "object" && "name" in a) {
        const obj = a as { name: unknown; url?: unknown };
        if (typeof obj.name !== "string") return null;
        return {
          name: obj.name,
          url: typeof obj.url === "string" ? obj.url : undefined,
        };
      }
      return null;
    })
    .filter((a): a is Author => a !== null);
}

function normalizeTags(raw: unknown): string[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.filter((t): t is string => typeof t === "string");
}

// Rough reading time: ~200 words per minute, minimum 1 minute.
function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getPost(zone: BlogZone, slug: string): Post | null {
  const file = path.join(blogDir(zone), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  // Drafts are excluded everywhere (index and direct route) at build time.
  if (data.draft === true) return null;

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    cover: typeof data.cover === "string" ? data.cover : undefined,
    authors: normalizeAuthors(data.authors),
    tags: normalizeTags(data.tags),
    readingTime: estimateReadingTime(content),
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
