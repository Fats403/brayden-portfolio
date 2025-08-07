import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_PATH = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  title: string;
  excerpt?: string;
  date: string;
  tags?: string[];
  readingTime: string;
  slug: string;
};

export type Post = {
  meta: PostMeta;
  content: string;
};

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(POSTS_PATH, `${slug}.mdx`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(file);

  if (!data.title || !data.date) {
    throw new Error(`Post ${slug} missing required frontmatter: title, date`);
  }

  const meta: PostMeta = {
    title: data.title,
    excerpt: data.excerpt ?? "",
    date: data.date,
    tags: data.tags ?? [],
    readingTime: readingTime(content).text,
    slug,
  };

  return { meta, content };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs.map(getPostBySlug);
  // sort by date desc
  return posts.sort((a, b) => +new Date(b.meta.date) - +new Date(a.meta.date));
}
