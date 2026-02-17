import { getAllPosts } from "@/lib/mdx";
import { Link } from "next-view-transitions";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { GlowCard } from "@/components/glow-card";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Blog";
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE;

export async function generateMetadata() {
  const posts = getAllPosts();
  const allTags = new Set<string>();
  posts.forEach((p) =>
    (p.meta.tags || []).forEach((t: string) => allTags.add(t))
  );

  const title = SITE_NAME ? `${SITE_NAME} | Blog` : "Blog";
  const description = "Latest posts, guides, and notes.";
  const canonical = SITE_URL ? `${SITE_URL}/blog` : "/blog";

  return {
    metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
    title,
    description,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": SITE_URL ? `${SITE_URL}/rss.xml` : "/rss.xml",
      },
    },
    keywords: Array.from(allTags),
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
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: TWITTER_HANDLE,
    },
  };
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-dvh">
      <Header />

      <main className="mt-10 mb-20">
        {/* Section heading — staggered entry */}
        <div
          className="flex items-center justify-between mb-4 blog-heading-enter"
          style={{ viewTransitionName: "blog-heading" }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-0.5 bg-foreground rounded-full" />
            <h1 className="text-sm font-semibold text-foreground tracking-tight">
              Blog
            </h1>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Animated divider */}
        <div className="blog-line-enter h-px bg-border mb-8" />

        {/* Post list — staggered card entries */}
        <div className="space-y-3">
          {posts.map(({ meta }, i) => (
            <div
              key={meta.slug}
              className="blog-card-enter"
              style={{ animationDelay: `${i * 80 + 150}ms` }}
            >
              <GlowCard className="group">
                <Link
                  href={`/blog/${meta.slug}`}
                  className="block"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2
                        className="font-semibold text-foreground tracking-tight text-[15px] group-hover:opacity-90 transition-opacity"
                        style={{
                          viewTransitionName: `post-title-${meta.slug}`,
                        }}
                      >
                        {meta.title}
                      </h2>
                      {meta.excerpt && (
                        <p
                          className="mt-2 text-[13px] text-muted-foreground leading-relaxed line-clamp-2"
                          style={{
                            viewTransitionName: `post-excerpt-${meta.slug}`,
                          }}
                        >
                          {meta.excerpt}
                        </p>
                      )}
                      <div
                        className="mt-3 flex items-center gap-3"
                        style={{
                          viewTransitionName: `post-meta-${meta.slug}`,
                        }}
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
                    </div>
                    <span className="shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-colors text-sm mt-1">
                      ↗
                    </span>
                  </div>
                </Link>
              </GlowCard>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
