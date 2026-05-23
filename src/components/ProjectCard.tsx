"use client";

import type { Mode, Project } from "@/types/project";
import {
  CORRIDOR_LABELS,
  SECTOR_LABELS,
  STATUS_LABELS,
  STATUS_TONE,
} from "@/lib/utils";
import SectorPattern from "./SectorPattern";

interface Props {
  project: Project;
  mode: Mode;
  active: boolean;
  onClick: () => void;
}

export default function ProjectCard({ project, mode, active, onClick }: Props) {
  const isCurrentBuild = project.status === "under-construction";

  return (
    <button
      onClick={onClick}
      className={`group relative text-left w-full overflow-hidden border transition-all duration-300 bg-cream hover:-translate-y-[2px] ${
        active
          ? "border-ink shadow-[0_8px_30px_-12px_rgba(28,26,23,0.25)]"
          : "border-ink/10 hover:border-ink/40 hover:shadow-[0_4px_16px_-6px_rgba(28,26,23,0.15)]"
      }`}
    >
      {/* Image area / sector pattern */}
      <div className="relative aspect-[5/3] w-full">
        {project.image_urls.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_urls[0]}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <SectorPattern sector={project.sector} className="absolute inset-0" variant="card" />
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span
            className={`label-caps inline-flex items-center gap-1.5 px-2 py-1 border rounded-sm bg-cream/95 backdrop-blur-sm ${STATUS_TONE[project.status]}`}
          >
            {isCurrentBuild && (
              <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-ember">
                <span className="pulse-ring" />
              </span>
            )}
            {STATUS_LABELS[project.status]}
          </span>

          {mode === "internal" && project.visibility !== "prospect-safe" && (
            <span className="label-caps px-2 py-1 bg-ink/85 text-cream rounded-sm">
              {project.visibility === "internal-only" ? "Internal" : "Review"}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-serif text-2xl leading-tight text-ink">
            {project.name}
          </h3>
          <p className="label-caps text-stone mt-1.5">
            {CORRIDOR_LABELS[project.corridor]}
            {project.neighborhood && project.neighborhood !== CORRIDOR_LABELS[project.corridor] && (
              <> · {project.neighborhood}</>
            )}
          </p>
        </div>

        <p className="text-sm text-charcoal/85 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {mode === "prospect"
            ? project.public_summary || "—"
            : project.buyer_signal || project.public_summary || "—"}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] font-medium px-2 py-0.5 bg-paper border border-ink/10 text-charcoal">
            {SECTOR_LABELS[project.sector]}
          </span>
          {project.capabilities_shown.slice(0, 2).map((c) => (
            <span
              key={c}
              className="text-[11px] font-medium px-2 py-0.5 bg-paper border border-ink/10 text-stone"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Internal mode — confidence indicator */}
        {mode === "internal" && (
          <div className="pt-2 mt-2 border-t border-ink/10 flex items-center justify-between text-[10px] tracking-wider uppercase">
            <span className="text-stone">Source confidence</span>
            <ConfidenceDots level={project.source_confidence} />
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <span
        className={`absolute inset-x-0 bottom-0 h-[2px] bg-ember transition-transform duration-300 origin-left ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </button>
  );
}

function ConfidenceDots({ level }: { level: "high" | "medium" | "low" }) {
  const filled = level === "high" ? 3 : level === "medium" ? 2 : 1;
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < filled ? "bg-ink" : "bg-ink/15"
          }`}
        />
      ))}
    </span>
  );
}
