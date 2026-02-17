import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { Prose } from "@/components/prose";
import { MDXComponents } from "@/components/mdx-components";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "next-view-transitions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE;

export async function generateStaticParams() {
  return getAllPosts().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { meta } = post;
  const title = meta.title;
  const description = meta.excerpt;
  const canonicalPath = `/blog/${slug}`;
  const canonical = SITE_URL ? `${SITE_URL}${canonicalPath}` : canonicalPath;
  const keywords: string[] | undefined = Array.isArray(meta.tags)
    ? meta.tags
    : undefined;

  const publishedTime = meta.date
    ? new Date(meta.date).toISOString()
    : undefined;
  const modifiedTime = publishedTime;

  return {
    metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
    title,
    description,
    alternates: { canonical },
    keywords,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      publishedTime,
      modifiedTime,
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: TWITTER_HANDLE,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post;
  const { slug } = await params;

  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content } = post;

  return (
    <div className="min-h-dvh">
      <Header />

      <main className="mt-10 mb-20">
        {/* Back link — morphs from blog heading */}
        <div style={{ viewTransitionName: "blog-heading" }}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>←</span>
            <span className="font-mono">Back to blog</span>
          </Link>
        </div>

        <article className="mt-8">
          {/* Article header — elements match blog list for morphing */}
          <div className="mb-10">
            <h1
              className="text-3xl md:text-4xl font-semibold leading-tight tracking-tighter text-foreground"
              style={{ viewTransitionName: `post-title-${meta.slug}` }}
            >
              {meta.title}
            </h1>

            {meta.excerpt && (
              <p
                className="mt-4 text-muted-foreground leading-relaxed"
                style={{ viewTransitionName: `post-excerpt-${meta.slug}` }}
              >
                {meta.excerpt}
              </p>
            )}

            <div
              className="mt-4 flex items-center gap-3"
              style={{ viewTransitionName: `post-meta-${meta.slug}` }}
            >
              <time className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                {new Date(meta.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
                {meta.readingTime}
              </span>
            </div>

            <div className="blog-line-enter mt-6 h-px bg-border" />
          </div>

          {/* Article body */}
          <div className="page-enter">
            <Prose>
              <MDXRemote source={content} components={MDXComponents} />
            </Prose>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
