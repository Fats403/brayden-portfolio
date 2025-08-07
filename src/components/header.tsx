"use client";
import { Link } from "next-view-transitions";
import ThemeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between py-6">
        <Link
          href="/"
          className="group inline-flex items-center font-medium text-foreground"
        >
          <span className="tracking-tight">Brayden Blackwell</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="text-sm text-muted-foreground">
            <ul className="flex items-center gap-5">
              {[
                ["Home", "/"],
                ["Contact", "/#contact"],
                ["Blog", "/blog"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    className="hover:text-foreground transition-colors"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
      <Separator />
    </header>
  );
}
