"use client";

import { FILTERS } from "@/lib/utils";

interface Props {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}

export default function FilterBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-thin">
      {FILTERS.map((f) => {
        const isActive = active === f.id;
        const count = counts[f.id] ?? 0;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "bg-ink text-cream border-ink"
                : "bg-cream text-charcoal border-ink/15 hover:border-ink/40 hover:bg-paper"
            }`}
          >
            <span className="text-[13px] font-medium">{f.label}</span>
            <span
              className={`text-[10px] tabular-nums font-mono px-1.5 rounded-full ${
                isActive ? "bg-cream/15 text-cream" : "bg-paper text-stone"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
