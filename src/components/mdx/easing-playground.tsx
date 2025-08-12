"use client";

import * as React from "react";

type EasingMode = "in" | "out" | "inOut";

type EasingPresetId =
  | "linear"
  | "sine"
  | "quad"
  | "cubic"
  | "quart"
  | "quint"
  | "expo"
  | "circ"
  | "back"
  | "elastic"
  | "bounce";

type VisualizationMode = "curve" | "opacity" | "size";

type EasingPreset = {
  id: EasingPresetId;
  label: string;
  modes: EasingMode[];
};

const EASING_PRESETS: EasingPreset[] = [
  { id: "linear", label: "Linear", modes: ["in", "out", "inOut"] },
  { id: "sine", label: "Sine", modes: ["in", "out", "inOut"] },
  { id: "quad", label: "Quadratic", modes: ["in", "out", "inOut"] },
  { id: "cubic", label: "Cubic", modes: ["in", "out", "inOut"] },
  { id: "quart", label: "Quartic", modes: ["in", "out", "inOut"] },
  { id: "quint", label: "Quintic", modes: ["in", "out", "inOut"] },
  { id: "expo", label: "Exponential", modes: ["in", "out", "inOut"] },
  { id: "circ", label: "Circular", modes: ["in", "out", "inOut"] },
  { id: "back", label: "Back", modes: ["in", "out", "inOut"] },
  { id: "elastic", label: "Elastic", modes: ["in", "out", "inOut"] },
  { id: "bounce", label: "Bounce", modes: ["in", "out", "inOut"] },
];

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function easeValue(
  preset: EasingPresetId,
  mode: EasingMode,
  u: number
): number {
  const x = clamp01(u);
  switch (preset) {
    case "linear":
      return x; // all modes identical for linear
    case "sine": {
      if (mode === "in") return 1 - Math.cos((Math.PI / 2) * x);
      if (mode === "out") return Math.sin((Math.PI / 2) * x);
      return 0.5 * (1 - Math.cos(Math.PI * x)); // inOut
    }
    case "quad": {
      if (mode === "in") return x * x;
      if (mode === "out") {
        const k = 1 - x;
        return 1 - k * k;
      }
      if (x < 0.5) return 2 * x * x;
      const k = 1 - x;
      return 1 - 2 * k * k;
    }
    case "cubic": {
      if (mode === "in") return x * x * x;
      if (mode === "out") {
        const k = 1 - x;
        return 1 - k * k * k;
      }
      if (x < 0.5) return 4 * x * x * x;
      const k = 1 - x;
      return 1 - 4 * k * k * k;
    }
    case "quart": {
      if (mode === "in") return x * x * x * x;
      if (mode === "out") {
        const k = 1 - x;
        return 1 - k * k * k * k;
      }
      if (x < 0.5) return 8 * x * x * x * x;
      const k = 1 - x;
      return 1 - 8 * k * k * k * k;
    }
    case "quint": {
      if (mode === "in") return x * x * x * x * x;
      if (mode === "out") {
        const k = 1 - x;
        return 1 - k * k * k * k * k;
      }
      if (x < 0.5) return 16 * x * x * x * x * x;
      const k = 1 - x;
      return 1 - 16 * k * k * k * k * k;
    }
    case "expo": {
      if (mode === "in") return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
      if (mode === "out") return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      if (x === 0) return 0;
      if (x === 1) return 1;
      if (x < 0.5) return Math.pow(2, 20 * x - 10) / 2;
      return (2 - Math.pow(2, -20 * x + 10)) / 2;
    }
    case "circ": {
      if (mode === "in") return 1 - Math.sqrt(1 - x * x);
      if (mode === "out") return Math.sqrt(1 - (x - 1) * (x - 1));
      if (x < 0.5) return (1 - Math.sqrt(1 - 2 * x * (2 * x))) / 2;
      return (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
    case "back": {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      if (mode === "in") return (c1 + 1) * x * x * x - c1 * x * x;
      if (mode === "out") {
        const t = x - 1;
        return 1 + (c1 + 1) * t * t * t + c1 * t * t;
      }
      if (x < 0.5) return (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2;
      const t = 2 * x - 2;
      return (Math.pow(t, 2) * ((c2 + 1) * t + c2) + 2) / 2;
    }
    case "elastic": {
      const c = (2 * Math.PI) / 3; // period
      if (mode === "in")
        return x === 0
          ? 0
          : x === 1
          ? 1
          : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c);
      if (mode === "out")
        return x === 0
          ? 0
          : x === 1
          ? 1
          : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c) + 1;
      // inOut
      const c2 = (2 * Math.PI) / 4.5;
      if (x === 0) return 0;
      if (x === 1) return 1;
      if (x < 0.5)
        return (
          -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c2)) / 2
        );
      return (
        (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c2)) / 2 + 1
      );
    }
    case "bounce": {
      const bounceOut = (t: number) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          t -= 1.5 / d1;
          return n1 * t * t + 0.75;
        } else if (t < 2.5 / d1) {
          t -= 2.25 / d1;
          return n1 * t * t + 0.9375;
        }
        t -= 2.625 / d1;
        return n1 * t * t + 0.984375;
      };
      if (mode === "in") return 1 - bounceOut(1 - x);
      if (mode === "out") return bounceOut(x);
      return x < 0.5
        ? (1 - bounceOut(1 - 2 * x)) / 2
        : (1 + bounceOut(2 * x - 1)) / 2;
    }
    default:
      return x;
  }
}

function formatNumber(value: number): string {
  const s = value.toFixed(3);
  return s.replace(/\.?(0+)$/g, "");
}

type PlaygroundProps = {
  defaultPreset?: EasingPresetId;
  defaultMode?: EasingMode;
  defaultView?: VisualizationMode;
};

export default function EasingPlayground({
  defaultPreset = "sine",
  defaultMode = "out",
  defaultView = "curve",
}: PlaygroundProps) {
  const [preset, setPreset] = React.useState<EasingPresetId>(defaultPreset);
  const [mode, setMode] = React.useState<EasingMode>(defaultMode);
  const [view, setView] = React.useState<VisualizationMode>(defaultView);
  const [u, setU] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  // Internal visualization defaults
  const baseSize = 48; // px
  const gain = 0.3; // 30% growth influenced by y
  const playDurationS = 3.0; // seconds for u to sweep 0→1

  const requestRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isPlaying) return;
    const step = (ts: number) => {
      const last = lastTsRef.current;
      lastTsRef.current = ts;
      if (last != null) {
        const dt = (ts - last) / 1000;
        const speed = 1 / Math.max(playDurationS, 0.001);
        setU((prev) => {
          let next = prev + dt * speed;
          while (next > 1) next -= 1;
          if (next < 0) next = 0;
          return next;
        });
      }
      requestRef.current = requestAnimationFrame(step);
    };
    requestRef.current = requestAnimationFrame(step);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
      lastTsRef.current = null;
    };
  }, [isPlaying, playDurationS]);

  const y = easeValue(preset, mode, u);

  // Chart constants
  const chartWidth = 640;
  const chartHeight = 260;
  const padding = 36;
  const innerW = chartWidth - padding * 2;
  const innerH = chartHeight - padding * 2;
  // Add vertical padding so overshoot curves (back/elastic/bounce) do not clip
  const yMin = -0.2;
  const yMax = 1.2;
  const yToPx = (val: number) =>
    padding + (1 - (val - yMin) / (yMax - yMin)) * innerH;

  const pathD = React.useMemo(() => {
    const N = 200;
    let dStr = "";
    for (let i = 0; i <= N; i += 1) {
      const uu = i / N;
      const yy = easeValue(preset, mode, uu);
      const x = padding + uu * innerW;
      const y = yToPx(yy);
      dStr += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return dStr;
  }, [preset, mode, innerW, innerH]);

  const playheadX = padding + u * innerW;
  const markerY = yToPx(y);

  const handleScrub = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    const rect = (e.target as SVGRectElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const uNew = clamp01((x - padding) / innerW);
    setU(uNew);
  };

  const onKeyNudge = (delta: number) => {
    setU((prev) => clamp01(prev + delta));
  };

  return (
    <div className="my-6 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-4">
        {/* Controls */}
        <div className="w-full grid grid-cols-2 gap-2">
          <label className="text-sm text-muted-foreground">Preset</label>
          <select
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            value={preset}
            onChange={(e) => setPreset(e.target.value as EasingPresetId)}
          >
            {EASING_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <label className="text-sm text-muted-foreground">Mode</label>
          <div className="flex items-center gap-2">
            {(["in", "out", "inOut"] as EasingMode[]).map((m) => (
              <label key={m} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                {m}
              </label>
            ))}
          </div>

          <label className="text-sm text-muted-foreground">View</label>
          <select
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            value={view}
            onChange={(e) => setView(e.target.value as VisualizationMode)}
          >
            <option value="curve">Curve</option>
            <option value="opacity">Opacity</option>
            <option value="size">Size</option>
          </select>

          <label className="text-sm text-muted-foreground">u (time)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={u}
              onChange={(e) => setU(Number(e.target.value))}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") onKeyNudge(-0.01);
                if (e.key === "ArrowRight") onKeyNudge(+0.01);
              }}
            />
          </div>

          <label className="text-sm text-muted-foreground">Play</label>
          <button
            type="button"
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            onClick={() => setIsPlaying((p) => !p)}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {/* Previews just above the chart, shown depending on view */}
        {view !== "curve" && (
          <div className="grid grid-cols-1 gap-2">
            {view === "opacity" && (
              <div className="rounded-md border border-border p-2">
                <div className="mb-1 text-xs text-muted-foreground">
                  Opacity preview
                </div>
                <div
                  className="h-10 rounded"
                  style={{ backgroundColor: `rgba(59,130,246,${y})` }}
                  title={`alpha=${formatNumber(y)}`}
                />
              </div>
            )}
            {view === "size" && (
              <div className="rounded-md border border-border p-2">
                <div className="mb-1 text-xs text-muted-foreground">
                  Size preview
                </div>
                <div className="flex h-10 items-center justify-center">
                  <span
                    style={{
                      fontSize: `${baseSize * (1 - gain + gain * y)}px`,
                    }}
                  >
                    Aa
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full-width chart (only when view=curve) */}
        {view === "curve" && (
          <div className="w-full">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label="Easing curve chart"
              className="w-full h-auto select-none"
            >
              {/* Background */}
              <rect
                x={0}
                y={0}
                width={chartWidth}
                height={chartHeight}
                fill="var(--background)"
              />
              {/* Plot area */}
              <rect
                x={padding}
                y={padding}
                width={innerW}
                height={innerH}
                fill="transparent"
                stroke="var(--border)"
                rx={6}
              />
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((g, idx) => {
                const y = yToPx(g);
                return (
                  <g key={`h-${idx}`}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={padding + innerW}
                      y2={y}
                      stroke="var(--border)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 8}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fontSize={12}
                      fill="var(--muted-foreground)"
                    >
                      {g}
                    </text>
                  </g>
                );
              })}
              {[0, 0.25, 0.5, 0.75, 1].map((g, idx) => {
                const x = padding + g * innerW;
                return (
                  <g key={`v-${idx}`}>
                    <line
                      x1={x}
                      y1={padding}
                      x2={x}
                      y2={padding + innerH}
                      stroke="var(--border)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={x}
                      y={padding + innerH + 16}
                      textAnchor="middle"
                      fontSize={12}
                      fill="var(--muted-foreground)"
                    >
                      {g}
                    </text>
                  </g>
                );
              })}
              {/* Curve */}
              <path
                suppressHydrationWarning
                d={mounted ? pathD : ""}
                fill="none"
                stroke="hsl(210 90% 55%)"
                strokeWidth={2.5}
              />
              {/* Playhead */}
              <line
                x1={playheadX}
                y1={padding}
                x2={playheadX}
                y2={padding + innerH}
                stroke="hsl(210 90% 55%)"
                strokeOpacity={0.4}
              />
              {/* Marker */}
              <circle
                cx={playheadX}
                cy={markerY}
                r={5}
                fill="hsl(210 90% 55%)"
              />
              {/* Scrub overlay */}
              <rect
                x={padding}
                y={padding}
                width={innerW}
                height={innerH}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onMouseDown={handleScrub}
                onMouseMove={(e) => {
                  if (e.buttons === 1) handleScrub(e);
                }}
              />
              {/* Axes labels */}
              <text
                x={padding + innerW / 2}
                y={chartHeight - 6}
                textAnchor="middle"
                fontSize={12}
                fill="var(--muted-foreground)"
              >
                normalized time u (0 → 1)
              </text>
              <text
                x={12}
                y={padding - 10}
                textAnchor="start"
                fontSize={12}
                fill="var(--muted-foreground)"
              >
                y = ease(u)
              </text>
            </svg>
          </div>
        )}

        {/* Formula panel removed to keep the demo focused on visualization */}
      </div>

      {/* Status & reset aligned edges */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono tabular-nums">
          <span className="inline-block w-20">u={formatNumber(u)}</span>
          <span className="inline-block w-20">y={formatNumber(y)}</span>
        </div>
        <button
          type="button"
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
          onClick={() => setU(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
