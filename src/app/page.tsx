import Footer from "@/components/footer";
import Header from "@/components/header";
import HomeContent from "@/components/home-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Brayden Blackwell";
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE;

export async function generateMetadata() {
  const title = SITE_NAME;
  const description =
    "Senior Software Engineer — building thoughtful, performant experiences. Projects, writing, and contact.";
  const canonical = SITE_URL ? `${SITE_URL}/` : "/";

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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
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

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <Header />

      <HomeContent />

      <Footer />
    </div>
  );
}
