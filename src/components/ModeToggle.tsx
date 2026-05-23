"use client";

import type { Mode } from "@/types/project";

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="inline-flex items-center p-1 bg-paper border border-ink/15 rounded-full">
      {(["internal", "prospect"] as const).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={`relative px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide transition-colors duration-200 ${
              active ? "text-cream" : "text-stone hover:text-ink"
            }`}
          >
            {active && (
              <span className="absolute inset-0 bg-ink rounded-full -z-0" />
            )}
            <span className="relative z-10 capitalize">
              {m === "internal" ? "Internal" : "Prospect"} Mode
            </span>
          </button>
        );
      })}
    </div>
  );
}
