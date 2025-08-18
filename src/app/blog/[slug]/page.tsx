import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { Prose } from "@/components/prose";
import { MDXComponents } from "@/components/mdx-components";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
    <>
      <Header />
      <main className="mt-5 relative min-h-screen">
        <article className="space-y-6 w-full">
          <div className="space-y-3">
            <h1
              className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
              style={{ viewTransitionName: `post-title-${meta.slug}` }}
            >
              {meta.title}
            </h1>

            <div className="space-y-4">
              {meta.excerpt && (
                <p className="text-muted-foreground">{meta.excerpt}</p>
              )}
              <div className="text-xs text-muted-foreground">
                {new Date(meta.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                • {meta.readingTime}
              </div>
            </div>
          </div>

          <div className="page-enter">
            <Prose>
              <MDXRemote source={content} components={MDXComponents as any} />
            </Prose>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
