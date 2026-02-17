"use client";
import { Link } from "next-view-transitions";
import ThemeToggle from "@/components/theme-toggle";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const navItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
    ],
    [],
  );

  return (
    <header className="w-full">
      <div className="flex items-center justify-between py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
          style={{ viewTransitionName: "header-logo" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://avatars.githubusercontent.com/u/30492327?s=400&u=57a6f5993e37d3de5b0a53a687235d970c8aaef5&v=4"
            alt="Brayden Blackwell"
            className="h-7 w-7 rounded-full border border-border object-cover"
          />
          <span className="text-[13px] font-mono text-muted-foreground">
            @Fats403
          </span>
        </Link>
        <div
          className="flex items-center gap-5"
          style={{ viewTransitionName: "header-nav" }}
        >
          <nav className="flex items-center gap-4 text-[13px] text-muted-foreground">
            {navItems.map(({ label, href }) => {
              const isActive =
                href === "/" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`transition-colors ${isActive ? "text-foreground" : "hover:text-foreground"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
      <div className="h-px bg-border" />
    </header>
  );
}
