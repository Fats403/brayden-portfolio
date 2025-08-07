"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { SkillMatrix } from "@/components/skill-matrix";

type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  repo?: string;
};

const projects: Project[] = [
  {
    title: "Creative Commerce",
    description:
      "Headless e-commerce storefront with server components and ISR.",
    tags: ["Next.js", "Tailwind", "Stripe", "Prisma"],
    href: "#",
    repo: "#",
  },
  {
    title: "Realtime Dashboard",
    description:
      "Streaming analytics dashboard with live metrics and smooth transitions.",
    tags: ["Next.js", "WebSockets", "Charts", "Vercel"],
    href: "#",
    repo: "#",
  },
  {
    title: "Design System",
    description:
      "Minimal component library with tokens, motion primitives, and a11y patterns.",
    tags: ["TypeScript", "Storybook", "Radix UI"],
    href: "#",
    repo: "#",
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      {/* Ambient gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[-10rem] h-[30rem] w-[40rem] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklab, var(--accent) 16%, transparent) 0%, transparent 60%)",
            filter: "blur(2rem)",
          }}
        />
      </div>

      {/* Content container */}
      <div
        className={`transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <section id="hero" className="mt-6 md:mt-8">
          <Hero />
        </section>

        <Separator className="my-10 md:my-12" />

        <section id="about">
          <About />
        </section>

        <Separator className="my-10 md:my-12" />

        <section id="experience">
          <Experience />
        </section>

        <Separator className="my-10 md:my-12" />

        <section id="projects">
          <Projects />
        </section>

        <Separator className="my-10 md:my-12" />

        <section id="skills">
          <Skills />
        </section>

        <Separator className="my-10 md:my-12" />

        <section id="contact" className="mb-6">
          <Contact />
        </section>
      </div>
    </main>
  );
}
function Hero() {
  return (
    <div className="relative">
      {/* Subhead chip */}
      <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] bg-secondary text-foreground/90 border-border shadow-sm backdrop-blur">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
        />
        Senior Software Engineer • Available for work
      </div>

      {/* Slight entrance only on first mount is already handled by parent container */}
      <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
        Designer-Developer crafting thoughtful, performant, and elegant digital
        experiences.
      </h1>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild size="sm">
          <a href="#projects">View Projects</a>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <a href="/resume.pdf">Download Resume</a>
        </Button>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">About Me</h2>
      <p className="text-muted-foreground">
        I'm a Senior Software Engineer who loves building scalable, reliable
        products—especially where performance and data meet. I've been coding
        since I was 13, and that early obsession turned into a career spent
        designing multi-tenant architectures, shipping cloud migrations, and
        mentoring teams.
      </p>
    </div>
  );
}

function Experience() {
  const items = [
    {
      role: "Backend Developer",
      org: "OnGuard",
      time: "06/2016 — 07/2020 • Calgary, AB",
      desc: "Built and maintained backend services and APIs; contributed to data workflows and performance tuning.",
    },
    {
      role: "Senior Software Engineer",
      org: "Enviros",
      time: "06/2024 — 04/2025 • Calgary, AB",
      desc: "Led full‑stack initiatives across frontend UX and backend APIs; delivered secure, reliable features at pace.",
    },
    {
      role: "Senior Software Engineer",
      org: "DataTrail Corp.",
      time: "02/2021 — Current • Calgary, AB",
      desc: "Owning end‑to‑end delivery: design systems, scalable APIs, data pipelines, and cloud infrastructure.",
    },
  ];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Experience</h2>
      {/* Timeline */}
      {/* @ts-ignore - after you create the component */}
      <ExperienceTimeline items={items} />
    </div>
  );
}

function Projects() {
  return (
    <div className="space-y-5 scroll-mt-20" id="projects">
      <h2 className="text-xl font-semibold">Projects</h2>
      <ul className="grid grid-cols-1 gap-3">
        {projects.map((p) => (
          <Card
            key={p.title}
            className="group transition-transform duration-200 hover:-translate-y-[1px]"
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <span className="sr-only">Open</span>↗
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="text-[10px] font-normal"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex gap-3 text-xs">
                {p.href && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="px-2 h-7"
                  >
                    <a href={p.href} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  </Button>
                )}
                {p.repo && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="px-2 h-7"
                  >
                    <a href={p.repo} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
}

function Skills() {
  const groups = [
    {
      label: "Frontend",
      items: [
        { name: "React", level: "pro" },
        { name: "Next.js", level: "pro" },
        { name: "Vue", level: "base" },
        { name: "Svelte", level: "base" },
        { name: "TypeScript", level: "pro" },
        { name: "JavaScript (ES6+)", level: "pro" },
        { name: "Tailwind CSS", level: "plus" },
        { name: "Framer Motion", level: "plus" },
        { name: "Responsive Design", level: "pro" },
      ],
    },
    {
      label: "Backend APIs",
      items: [
        { name: "Node.js", level: "pro" },
        { name: "Express", level: "plus" },
        { name: "Django", level: "base" },
        { name: "Fastify", level: "plus" },
        { name: "Elysia", level: "base" },
        { name: "Hono", level: "base" },
        { name: "tRPC", level: "plus" },
        { name: "RESTful APIs", level: "pro" },
        { name: "Microservices Architecture", level: "plus" },
      ],
    },
    {
      label: "Databases",
      items: [
        { name: "MySQL", level: "pro" },
        { name: "PostgreSQL", level: "pro" },
        { name: "Drizzle ORM", level: "plus" },
        { name: "MongoDB", level: "plus" },
        { name: "SQL Optimization", level: "pro" },
        { name: "Multi-tenant Architecture", level: "pro" },
      ],
    },
    {
      label: "Cloud & Infra",
      items: [
        { name: "AWS", level: "plus" },
        { name: "GCP", level: "base" },
        { name: "Azure", level: "base" },
        { name: "Docker", level: "pro" },
      ],
    },
    {
      label: "Auth & Security",
      items: [
        { name: "Clerk", level: "plus" },
        { name: "JWT", level: "pro" },
        { name: "OAuth", level: "plus" },
        { name: "RBAC", level: "plus" },
        { name: "HIPAA-Compliant Data", level: "plus" },
      ],
    },
    {
      label: "AI/ML & Analytics",
      items: [
        { name: "Python", level: "plus" },
        { name: "TensorFlow", level: "base" },
        { name: "Machine Learning", level: "plus" },
        { name: "Geospatial Analysis", level: "plus" },
        { name: "Data Viz (Recharts, D3)", level: "plus" },
      ],
    },
    {
      label: "DevOps",
      items: [
        { name: "Git/GitHub", level: "pro" },
        { name: "Azure Repos", level: "base" },
        { name: "GitHub Actions", level: "plus" },
        { name: "GCR", level: "base" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Skills</h2>
      {/* @ts-ignore - after you create the component */}
      <SkillMatrix groups={groups} />
    </div>
  );
}

function Contact() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Contact</h2>
      <p className="text-muted-foreground">
        Want to collaborate or have a project in mind? I’d love to hear from
        you.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="mailto:braydenblackwell21@gmail.com">Email Me</a>
        </Button>
        <Button asChild variant="secondary">
          <a href="https://github.com/fats403" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
