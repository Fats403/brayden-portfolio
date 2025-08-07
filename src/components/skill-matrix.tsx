import { Card, CardContent } from "@/components/ui/card";

type Item = {
  role: string;
  org: string;
  time: string;
  desc: string;
};

export function ExperienceTimeline({ items }: { items: Item[] }) {
  return (
    <div className="relative">
      {/* Axis */}
      <div
        className="absolute left-[10px] top-0 bottom-0 w-px bg-border/80"
        aria-hidden
      />
      <ul className="space-y-6">
        {items.map((i) => (
          <li key={`${i.org}-${i.role}`} className="relative pl-8">
            {/* Dot */}
            <div className="absolute left-[6px] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground" />
            <Card className="group">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-medium">
                    {i.role} •{" "}
                    <span className="text-muted-foreground">{i.org}</span>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {i.time}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Group = {
  label: string;
  items: { name: string; level?: "base" | "plus" | "pro" }[];
};

const levelClass = {
  base: "bg-secondary text-foreground border border-border/80",
  plus: "bg-secondary text-foreground border border-border/60",
  pro: "bg-secondary text-foreground border border-border/40 shadow-[inset_0_0_0_1px_var(--color-border)]",
};

export function SkillMatrix({ groups }: { groups: Group[] }) {
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-2 text-sm font-medium">{g.label}</div>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((s) => (
              <span
                key={s.name}
                className={[
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] leading-5",
                  levelClass[s.level ?? "base"],
                ].join(" ")}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
