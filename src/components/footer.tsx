"use client";

export default function Footer() {
  return (
    <footer className="w-full text-xs text-muted-foreground/50 pb-8">
      <div className="h-px bg-border/50 mb-6" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px]">
          © {new Date().getFullYear()} Brayden Blackwell
        </span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-[10px] hover:text-muted-foreground transition-colors cursor-pointer"
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      </div>
    </footer>
  );
}
