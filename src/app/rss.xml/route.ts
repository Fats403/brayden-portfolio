import { getAllPosts } from "@/lib/mdx";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

function cdata(value?: string): string {
  if (!value) return "";
  return `<![CDATA[${value}]]>`;
}

export const revalidate = 3600; // re-generate hourly

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const siteLink = baseUrl || "/";
  const title = process.env.NEXT_PUBLIC_SITE_NAME
    ? `${process.env.NEXT_PUBLIC_SITE_NAME} | Blog`
    : "Blog";
  const description = "Latest posts, guides, and notes.";

  const itemsXml = posts
    .map(({ meta }) => {
      const url = `${baseUrl}/blog/${meta.slug}`;
      const pubDate = new Date(meta.date).toUTCString();
      const categories = (meta.tags || [])
        .map((t) => `<category>${cdata(t)}</category>`)
        .join("");

      return `
        <item>
          <title>${cdata(meta.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${pubDate}</pubDate>
          ${
            meta.excerpt
              ? `<description>${cdata(meta.excerpt)}</description>`
              : ""
          }
          ${categories}
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${cdata(title)}</title>
    <link>${siteLink}</link>
    <description>${cdata(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>1800</ttl>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
