"use client";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full mt-10 text-xs text-muted-foreground">
      <Separator className="mb-6" />
      <div className="flex items-center justify-between">
        <span>© {new Date().getFullYear()} Brayden Blackwell</span>
        <button
          type="button"
          onClick={handleBackToTop}
          className="hover:text-foreground transition-colors"
          aria-label="Back to top"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
