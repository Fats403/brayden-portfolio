import { getAllPosts } from "@/lib/mdx";
import { Link } from "next-view-transitions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    alternates: { canonical },
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
  } as any;
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mt-5 relative flex flex-col items-center">
      {/* Ambient blur strip */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[-1] h-24"
      >
        <div
          className="absolute inset-x-0 top-0 h-24"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent), transparent)",
            filter: "blur(18px)",
            opacity: 0.7,
          }}
        />
      </div>

      <div className="w-full page-enter">
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <h1 className="text-xl font-semibold">Blog</h1>
            <div className="text-[11px] text-muted-foreground">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Featured first post (optional) */}
          {posts[0] && <FeaturedPost meta={posts[0].meta} />}

          {/* Divider after featured */}
          {posts.length > 1 && (
            <div className="my-4 h-px w-full bg-border/60" />
          )}

          <ul className="grid grid-cols-1 gap-3">
            {posts.slice(1).map(({ meta }) => (
              <li key={meta.slug}>
                <BlogCard meta={meta} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function BlogCard({ meta }: { meta: any }) {
  return (
    <Card className="group hover:-translate-y-[1px]">
      <CardContent className="">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="font-medium hover:opacity-90"
              style={{ viewTransitionName: `post-title-${meta.slug}` }}
            >
              <Link href={`/blog/${meta.slug}`}>{meta.title}</Link>
            </h2>

            <div className="space-y-1">
              <p className="mt-1 text-sm text-muted-foreground">
                {meta.excerpt ?? ""}
              </p>
              <div className="mt-2 text-[11px] text-muted-foreground">
                {new Date(meta.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                • {meta.readingTime}
              </div>
            </div>
          </div>
          {/* caret */}
          <div className="shrink-0 text-muted-foreground">↗</div>
        </div>
        {meta.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meta.tags.map((t: string) => (
              <Badge
                key={t}
                variant="outline"
                className="text-[10px] font-normal"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FeaturedPost({ meta }: { meta: any }) {
  return (
    <Card
      className="group border-border/80"
      style={{ viewTransitionName: `post-container-${meta.slug}` }}
    >
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/blog/${meta.slug}`}>
              <h2
                className="text-[1.125rem] font-semibold leading-snug hover:opacity-90 transition"
                style={{ viewTransitionName: `post-title-${meta.slug}` }}
              >
                {meta.title}
              </h2>
            </Link>
            <div
              className="space-y-1"
              style={{ viewTransitionName: `post-block-${meta.slug}` }}
            >
              <p className="mt-2 text-[0.95rem] text-muted-foreground">
                {meta.excerpt ?? ""}
              </p>
              <div className="mt-2 text-[11px] text-muted-foreground">
                {new Date(meta.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                • {meta.readingTime}
              </div>
            </div>
          </div>
          <div className="shrink-0 text-muted-foreground">↗</div>
        </div>
        {meta.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meta.tags.map((t: string) => (
              <Badge
                key={t}
                variant="outline"
                className="text-[10px] font-normal"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
