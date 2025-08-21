import { getAllPosts } from "@/lib/mdx";
import { Link } from "next-view-transitions";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-6rem)]">
      <Header />
      <main
        className="mt-5 relative flex-1"
        style={{
          viewTransitionName: "page",
        }}
      >
        <div className="w-full">
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <h1 className="text-xl font-semibold">Blog Posts</h1>
              <div className="text-[11px] text-muted-foreground">
                {posts.length} post{posts.length !== 1 ? "s" : ""}
              </div>
            </div>

            <ul className="divide-y divide-border/60">
              {posts.map(({ meta }) => (
                <li key={meta.slug}>
                  <Link
                    href={`/blog/${meta.slug}`}
                    className="group block px-4 py-3 rounded-md border border-border/60 transition-colors bg-secondary/40 hover:bg-background"
                  >
                    <div className="flex items-start gap-4">
                      <time className="w-[5.5rem] shrink-0 text-[11px] text-muted-foreground tabular-nums">
                        {new Date(meta.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <div className="flex-1">
                        <h2
                          className="font-medium tracking-tight group-hover:opacity-90"
                          style={{
                            viewTransitionName: `post-title-${meta.slug}`,
                          }}
                        >
                          {meta.title}
                        </h2>
                        {meta.excerpt && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {meta.excerpt}
                          </p>
                        )}
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          {meta.readingTime}
                        </div>
                      </div>
                      <span className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        ↗
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
