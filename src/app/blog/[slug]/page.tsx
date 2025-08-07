import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/prose";
import { MDXComponents } from "@/components/mdx-components";

export async function generateStaticParams() {
  return getAllPosts().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const { meta, content } = post!;

  return (
    <main className="mt-5 relative flex min-h-screen flex-col items-center">
      <div className="page-enter">
        <article className="space-y-6">
          <div className="space-y-3">
            <h1
              className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
              style={{ viewTransitionName: `post-title-${meta.slug}` }}
            >
              {meta.title}
            </h1>

            <div className="space-y-1">
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

          <Prose>
            <MDXRemote source={content} components={MDXComponents as any} />
          </Prose>
        </article>
      </div>
    </main>
  );
}
