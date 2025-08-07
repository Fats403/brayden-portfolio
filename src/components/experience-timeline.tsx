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
        className="absolute left-[10px] top-0 bottom-0 w-px bg-border"
        aria-hidden
      />
      <ul className="space-y-6">
        {items.map((i) => (
          <li key={`${i.org}-${i.role}`} className="pt-4 relative pl-8">
            {/* Dot */}
            <div className="absolute left-[6px] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground" />
            <div className="mt-4 flex flex-col gap-2">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
