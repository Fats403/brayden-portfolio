"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

function SunMoonIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      className="transition-transform duration-300"
      style={{
        transform: isDark
          ? "rotate(45deg) scale(1)"
          : "rotate(90deg) scale(0.98)",
      }}
    >
      <g
        style={{ opacity: isDark ? 1 : 0 }}
        className="transition-opacity duration-200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4.25" />
        <path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.364 5.636 16.6 7.4M7.4 16.6 5.636 18.364M18.364 18.364 16.6 16.6M7.4 7.4 5.636 5.636" />
      </g>
      <g
        style={{ opacity: isDark ? 0 : 1 }}
        className="transition-opacity duration-200"
        fill="currentColor"
      >
        <path d="M16.5 12.2a5.8 5.8 0 1 1-5.7-7.2 7 7 0 1 0 7 7c0-.28-.02-.56-.06-.83-0.42.12-.86.19-1.24.19z" />
      </g>
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  let vtBusy = false;

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const resolved = theme === "system" ? systemTheme : theme;
  const isDark = resolved === "dark";
  const next = isDark ? "light" : "dark";

  const onToggle = async () => {
    const start = (document as any).startViewTransition?.bind(document);

    if (vtBusy) return; // ignore rapid clicks
    vtBusy = true;

    if (!start) {
      setTheme(next);
      vtBusy = false;
      return;
    }

    const root = document.documentElement;

    const vt = start(() => {
      flushSync(() => {
        if (next === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      });

      // Keep next-themes in sync
      setTheme(next);
    });

    // Wait for snapshot of new DOM
    await vt?.ready;

    (root as any).animate(
      {
        clipPath: [`circle(0px at 50% 50%)`, `circle(150% at 50% 50%)`],
      },
      {
        duration: 520,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    await vt?.finished.catch(() => {});
    vtBusy = false;
  };

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="inline-flex h-8 w-8 items-center justify-center text-foreground hover:brightness-105 transition"
    >
      <SunMoonIcon isDark={isDark ?? false} />
    </button>
  );
}
