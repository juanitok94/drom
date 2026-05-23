"use client";

import type { Project } from "@/types/project";

interface Props {
  projects: Project[];
  filtered: Project[];
}

export default function StatsBar({ projects, filtered }: Props) {
  const completed = projects.filter((p) => p.status === "completed").length;
  const current = projects.filter((p) => p.status === "under-construction").length;
  const needsConf = projects.filter(
    (p) => p.status === "needs-confirmation" || p.source_confidence === "low"
  ).length;
  const featured = projects.filter((p) => p.featured).length;

  const stats = [
    { label: "Showing", value: filtered.length, total: projects.length },
    { label: "Completed", value: completed },
    { label: "Current Builds", value: current, accent: "ember" },
    { label: "Needs Confirmation", value: needsConf, accent: "stone" },
    { label: "Featured", value: featured },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-ink/10 border border-ink/10">
      {stats.map((s) => (
        <div key={s.label} className="bg-cream px-4 py-3">
          <div className="label-caps text-stone">{s.label}</div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              className={`font-serif text-3xl leading-none ${
                s.accent === "ember" ? "text-ember" : "text-ink"
              }`}
            >
              {s.value}
            </span>
            {s.total !== undefined && s.total !== s.value && (
              <span className="text-stone text-sm font-mono tabular-nums">
                / {s.total}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
