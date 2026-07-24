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

// A post is published unless its frontmatter explicitly opts out. Two flags do
// this, both meaning "keep it out of the live site for now":
//   published: false  -> written but pending release (e.g. an unshipped article)
//   draft: true       -> work in progress (legacy flag, still honored)
// Unpublished posts are hidden everywhere - the index, the direct route, the
// sitemap and the statically-generated params - because every slug enumeration
// goes through getPostSlugs, which filters them out here.
function isPublished(data: Record<string, unknown>): boolean {
  if (data.draft === true) return false;
  if (data.published === false) return false;
  return true;
}

export function getPostSlugs(zone: BlogZone): string[] {
  const dir = blogDir(zone);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      return isPublished(matter(raw).data);
    })
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

  // Defense in depth: getPostSlugs already filters unpublished posts, but a
  // direct getPost(slug) call must never resurrect one.
  if (!isPublished(data)) return null;

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

// "Related" posts, kept deliberately simple: we don't score by tags or content,
// we just walk the date-sorted list forward from the current post and wrap
// around at the end. This is the "next, then next again, looping" behavior -
// enough to always surface `count` other posts as long as they exist.
export function getRelatedPosts(
  zone: BlogZone,
  slug: string,
  count = 2,
): PostMeta[] {
  const all = getAllPosts(zone);
  if (all.length <= 1) return [];

  const idx = all.findIndex((p) => p.slug === slug);
  const start = idx === -1 ? 0 : idx;

  const related: PostMeta[] = [];
  for (let step = 1; step <= all.length - 1 && related.length < count; step++) {
    related.push(all[(start + step) % all.length]);
  }
  return related;
}
