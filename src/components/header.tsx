"use client";
import { Link } from "next-view-transitions";
import ThemeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const navItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
    ],
    []
  );

  return (
    <header className="w-full">
      <div className="flex items-center justify-between py-6">
        <Link
          href="/"
          className="group inline-flex items-center font-medium text-foreground"
        >
          <Avatar>
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/30492327?s=400&u=57a6f5993e37d3de5b0a53a687235d970c8aaef5&v=4"
              alt="Brayden Blackwell Logo"
            />
            <AvatarFallback>BB</AvatarFallback>
          </Avatar>
          <span className="ml-2 tracking-tight">@Fats403</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="text-sm text-muted-foreground">
            <div className="relative">
              <ul className="flex items-center gap-5 pb-2">
                {navItems.map(({ label, href }) => {
                  const isActive =
                    href === "/"
                      ? pathname === href
                      : pathname.startsWith(href);
                  return (
                    <li key={label} className="relative">
                      <Link
                        className="hover:text-foreground transition-colors"
                        href={href}
                      >
                        <span className="relative">{label}</span>
                      </Link>
                      {isActive && (
                        <span
                          style={{ viewTransitionName: "nav-underline" }}
                          className="pointer-events-none absolute -bottom-2 left-0 right-0 h-[2px] bg-foreground"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
          <ThemeToggle />
        </div>
      </div>
      <Separator />
    </header>
  );
}
