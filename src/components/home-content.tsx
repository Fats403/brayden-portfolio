"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const experience = [
  {
    role: "Senior Software Engineer",
    company: "Yana Motion Labs",
    period: "2023 — Present",
    location: "Calgary, AB",
    description:
      "Rebuilt the website from scratch with a modern, accessible, performance-first stack using React. Implemented HIPAA-compliant AI pipelines and internal tooling, and led a technical SEO initiative that pushed 5+ target keywords onto the first page of search results.",
  },
  {
    role: "Senior Software Engineer",
    company: "Enviros",
    period: "06/2024 — 04/2025",
    location: "Calgary, AB",
    description:
      "Built a secure platform handling sensitive children's data, where every feature required rigorous security review and strict compliance standards. Architected multi-tenant MySQL/Drizzle with granular RBAC, full audit trails, and encryption at rest. Developed CANS-aligned assessment interfaces with analytics dashboards that cut completion times by roughly 45%.",
  },
  {
    role: "Senior Software Engineer",
    company: "DataTrail Corp.",
    period: "02/2021 — 07/2025",
    location: "Calgary, AB",
    description:
      "Owned the full product lifecycle for critical GIS applications, from planning through delivery. Modernized legacy .NET/C# and React systems, built IoT device integrations from firmware to server to UI, and migrated payments from PayPal to Stripe. Mentored junior developers and introduced CI/CD pipelines across the microservices stack.",
  },
  {
    role: "Junior Backend Developer",
    company: "OnGuard",
    period: "06/2016 — 07/2020",
    location: "Calgary, AB",
    description:
      "Built and maintained Node.js and C# REST APIs and microservices with CI/CD and monitoring. Integrated third-party services to automate and scale data workflows across the platform.",
  },
];

const projects = [
  {
    title: "simple-ffmpegjs",
    description:
      "Declarative video composition for Node.js — define clips, transitions, text overlays, and audio as simple objects, and let FFmpeg handle the rest. Zero dependencies, TypeScript ready, with pre-validation and platform presets.",
    tags: ["FFmpeg", "Node.js", "Open Source"],
    href: undefined as string | undefined,
    repo: "https://github.com/fats403/simple-ffmpegjs",
  },
  {
    title: "VideoVenture",
    description:
      "AI-powered video editor that turns raw photos, clips, and audio into polished, directed videos. Describe your vision in plain English — the AI handles editing, music, and rendering. No timeline, no film school.",
    tags: ["TypeScript", "React", "Node.js", "AI Video", "SaaS"],
    href: "https://www.videoventure.ai/",
  },
  {
    title: "Word Wurm",
    description:
      "A simple browser based word game that is based off one of my favorite pop-cap games Book Worm.",
    tags: ["Next.js", "Game", "TailwindCSS"],
    href: "https://www.wordwurm.com/",
    repo: "https://github.com/fats403/word-wurm",
  },
];

const skillGroups = [
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "Vue",
      "Svelte",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "C# / .NET",
      "Express",
      "Fastify",
      "Hono",
      "tRPC",
      "REST APIs",
      "Microservices",
    ],
  },
  {
    label: "Data",
    items: ["MySQL", "PostgreSQL", "Drizzle ORM", "MongoDB", "Multi-tenant"],
  },
  {
    label: "Cloud",
    items: ["AWS", "GCP", "Docker", "GitHub Actions"],
  },
  {
    label: "AI / ML",
    items: ["Python", "TensorFlow", "ML", "Data Viz"],
  },
  {
    label: "Security",
    items: ["JWT", "OAuth", "RBAC", "HIPAA"],
  },
];

const metrics = [
  { value: "10+", label: "Years Deep" },
  { value: "∞", label: "Tabs Open" },
  { value: "24/7", label: "Locked In" },
  { value: "0", label: "Regrets" },
];

// ─── Hooks ─────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -30px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(1.25rem)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { ref, count };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-block h-3 w-0.5 bg-foreground rounded-full" />
      <h2 className="text-sm font-semibold text-foreground tracking-tight">
        {label}
      </h2>
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  const numericPart = parseInt(value);
  const suffix = value.replace(/\d+/, "");
  const { ref, count } = useCountUp(isNaN(numericPart) ? 0 : numericPart, 1000);

  return (
    <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 text-center">
      <span
        ref={ref}
        className="block text-2xl font-bold text-foreground tracking-tight font-mono"
      >
        {isNaN(numericPart) ? value : `${count}${suffix}`}
      </span>
      <span className="block mt-1 text-[10px] text-muted-foreground/70 font-mono uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`sig-glow-card rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-border ${className}`}
      onMouseMove={(e) => {
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
    >
      {children}
    </div>
  );
}

// ─── Main Content ──────────────────────────────────────────────────────────────

export default function HomeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mt-10 mb-20 md:mb-28">
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(1rem)",
            transition:
              "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for work
          </div>
        </div>

        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(1.5rem)",
            transition:
              "opacity 1s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
          <h1 className="mt-8 text-5xl md:text-7xl font-semibold leading-[0.92] tracking-tighter text-foreground">
            Brayden
            <br />
            Blackwell
          </h1>
        </div>

        <div
          className="mono-hero-line mt-8 h-px bg-border origin-left"
          style={{ opacity: mounted ? 1 : 0 }}
        />

        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(1rem)",
            transition:
              "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s",
          }}
        >
          <p className="mt-6 text-lg text-muted-foreground">
            Senior Software Engineer
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">
            Pretty much all I do is code. Building thoughtful, performant
            experiences from Calgary, AB.
          </p>
        </div>

        {/* Metrics */}
        <div
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(1rem)",
            transition:
              "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s",
          }}
        >
          {metrics.map((m) => (
            <MetricCard key={m.label} value={m.value} label={m.label} />
          ))}
        </div>

        <div
          className="flex gap-3 mt-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(1rem)",
            transition:
              "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s",
          }}
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View Projects
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
          >
            Download Resume
          </a>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────── */}
      <section className="mb-20 md:mb-24">
        <Reveal>
          <SectionBar label="About" />
          <div className="mt-6 space-y-4 text-muted-foreground leading-[1.7]">
            <p>
              I&apos;ve been writing code since I was thirteen. Started with
              Flash games, moved on to real jobs, and somehow never picked up a
              backup career. Pretty much all I do is code. I say that like
              it&apos;s a joke but it&apos;s really just the truth.
            </p>
            <p>
              Once I start on something it kind of takes over.. I get locked in
              on the details until every edge case is handled and the whole
              thing feels right. I like systems that make sense, UIs that stay
              out of the way, and shipping things that actually work. When
              I&apos;m not building products I&apos;m usually building tools to
              help me build products faster.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Experience ───────────────────────────────────────── */}
      <section className="mb-20 md:mb-24">
        <Reveal>
          <SectionBar label="Experience" />
        </Reveal>
        <div className="mt-6 space-y-3">
          {experience.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <GlowCard>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground text-[14px]">
                      {item.company}
                    </h3>
                    <p className="text-sm text-muted-foreground/80">
                      {item.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60 font-mono whitespace-nowrap">
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/30" />
                    {item.period}
                  </div>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────── */}
      <section id="projects" className="mb-20 md:mb-24 scroll-mt-24">
        <Reveal>
          <SectionBar label="Projects" />
        </Reveal>
        <div className="mt-6 space-y-3">
          {projects.map((project, i) => (
            <Reveal key={i} delay={i * 80}>
              <GlowCard className="group">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-foreground tracking-tight text-[15px]">
                    {project.title}
                  </h3>
                  <span className="text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-colors text-sm">
                    ↗
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-muted-foreground/60 bg-secondary/50 border border-border/40 rounded-md px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  {project.href && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                      [live]
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                      [source]
                    </a>
                  )}
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────── */}
      <section className="mb-20 md:mb-24">
        <Reveal>
          <SectionBar label="Skills" />
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-5">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2.5">
                  {group.label}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="text-[12px] text-foreground/70 flex items-center gap-2"
                    >
                      <span className="h-px w-2 bg-border" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section className="mb-20">
        <Reveal>
          <SectionBar label="Contact" />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Want to collaborate or have a project in mind? I&apos;d love to hear
            from you.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href="mailto:braydenblackwell21@gmail.com"
              className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Email Me
            </a>
            <a
              href="https://github.com/fats403"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
            >
              GitHub
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
