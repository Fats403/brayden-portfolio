"use client";

import type { ReactNode } from "react";

export function GlowCard({
  children,
  className = "",
  as: Component = "div",
  ...props
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "a";
  [key: string]: unknown;
}) {
  return (
    <Component
      className={`sig-glow-card rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-border ${className}`}
      onMouseMove={(e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--mouse-x",
          `${e.clientX - rect.left}px`,
        );
        e.currentTarget.style.setProperty(
          "--mouse-y",
          `${e.clientY - rect.top}px`,
        );
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
