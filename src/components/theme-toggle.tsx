"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function SunMoonIcon({ showMoon }: { showMoon: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      {/* Sun */}
      <g
        style={{ opacity: showMoon ? 0 : 1 }}
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

      {/* Moon */}
      <g
        style={{ opacity: showMoon ? 1 : 0 }}
        className="transition-opacity duration-200"
        fill="currentColor"
      >
        <path d="M 15.5 2.8 A 9.2 9.2 0 1 0 21.2 14.7 A 6.8 6.8 0 1 1 15.5 2.8 Z" />
      </g>
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  let vtBusy = false;

  useEffect(() => setMounted(true), []);

  // Placeholder to reserve space and avoid layout shift on SSR
  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-flex h-8 w-8 items-center justify-center rounded-md"
      />
    );
  }

  const resolved = theme === "system" ? systemTheme : theme;
  const isDark = resolved === "dark";
  const next = isDark ? "light" : "dark";
  const showMoon = !isDark;

  const onToggle = async () => {
    const start = document.startViewTransition?.bind(document);
    const root = document.documentElement;

    if (vtBusy) return;
    vtBusy = true;

    if (!start) {
      setTheme(next);
      vtBusy = false;
      return;
    }

    const vt = start(() => {
      // Syncronize next-themes
      setTheme(next);
    });

    await vt?.ready;

    const goingToDark = next === "dark";
    const keyframes = goingToDark
      ? { clipPath: ["inset(100% 0 0 0)", "inset(0 0 0 0)"] } // bottom→top
      : { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"] }; // top→bottom

    root.animate(keyframes, {
      duration: 500,
      easing: "cubic-bezier(.22,.75,.15,1)",
      pseudoElement: "::view-transition-new(root)",
      fill: "forwards",
    });

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
      <SunMoonIcon showMoon={showMoon} />
    </button>
  );
}
