"use client";

import type { Corridor, Project } from "@/types/project";
import { CORRIDOR_LABELS, CORRIDOR_POSITIONS, groupByCorridor } from "@/lib/utils";

interface Props {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function StylizedMap({ projects, selectedId, onSelect }: Props) {
  const groups = groupByCorridor(projects);
  const corridorsPresent = Object.keys(groups) as Corridor[];

  return (
    <div className="relative w-full h-full bg-paper paper-grain overflow-hidden">
      {/* Compass / reference */}
      <div className="absolute top-5 right-5 z-10 text-stone select-none">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="0.5" />
          <path d="M20 4 L23 20 L20 18 L17 20 Z" fill="currentColor" />
          <path d="M20 36 L17 20 L20 22 L23 20 Z" fill="currentColor" opacity="0.4" />
          <text x="20" y="11" textAnchor="middle" fontSize="6" fill="currentColor" className="font-mono">N</text>
        </svg>
      </div>

      {/* Decorative grid lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(28,26,23,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />

        {/* Suggestive corridor lines — the French Broad-ish curve & I-240 */}
        <path
          d="M 5,40 Q 35,55 50,60 T 95,75"
          stroke="rgba(60,80,90,0.18)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          transform="scale(0.01,0.01) translate(0,0)"
        />
      </svg>

      {/* Soft river & corridor sketches with absolute % coords */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* French Broad-ish river */}
        <path
          d="M 5,30 Q 25,55 48,60 T 90,90"
          stroke="rgba(92,107,74,0.22)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Haywood Road suggestion */}
        <path
          d="M 8,50 L 38,52"
          stroke="rgba(184,148,95,0.4)"
          strokeWidth="0.7"
          strokeDasharray="1.5 1"
          fill="none"
        />
        {/* Broadway / Downtown axis */}
        <path
          d="M 50,28 L 60,55"
          stroke="rgba(184,148,95,0.4)"
          strokeWidth="0.7"
          strokeDasharray="1.5 1"
          fill="none"
        />
      </svg>

      {/* Corridor clusters */}
      <div className="absolute inset-0">
        {corridorsPresent.map((corridor) => {
          const pos = CORRIDOR_POSITIONS[corridor];
          const projectsInCorridor = groups[corridor];
          return (
            <CorridorCluster
              key={corridor}
              x={pos.x}
              y={pos.y}
              label={CORRIDOR_LABELS[corridor]}
              projects={projectsInCorridor}
              selectedId={selectedId}
              onSelect={onSelect}
              isUnknown={corridor === "unknown"}
            />
          );
        })}
      </div>

      {/* Footer caption */}
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-stone pointer-events-none">
        <p className="label-caps">Stylized Spatial Index</p>
        <p className="font-serif italic text-sm opacity-70">
          Not to scale — a field guide, not a map.
        </p>
      </div>

      {projects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif italic text-stone text-lg">No projects match these filters.</p>
        </div>
      )}
    </div>
  );
}

function CorridorCluster({
  x,
  y,
  label,
  projects,
  selectedId,
  onSelect,
  isUnknown,
}: {
  x: number;
  y: number;
  label: string;
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isUnknown: boolean;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Cluster ring */}
      <div className="relative">
        <div
          className={`absolute -inset-6 rounded-full border ${
            isUnknown
              ? "border-stone/30 border-dashed"
              : "border-ink/15 border-dashed"
          }`}
        />
        <div className="relative flex flex-col items-center gap-1.5">
          <span
            className={`label-caps px-2 py-0.5 ${
              isUnknown
                ? "bg-stone/15 text-stone"
                : "bg-cream text-charcoal border border-ink/10"
            }`}
          >
            {label}
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center max-w-[180px]">
            {projects.map((p) => (
              <ProjectPin
                key={p.id}
                project={p}
                selected={selectedId === p.id}
                onClick={() => onSelect(p.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectPin({
  project,
  selected,
  onClick,
}: {
  project: Project;
  selected: boolean;
  onClick: () => void;
}) {
  const isCurrent = project.status === "under-construction";
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border text-[11px] transition-all duration-200 ${
        selected
          ? "bg-ink text-cream border-ink scale-105 shadow-md z-10"
          : "bg-cream/95 text-charcoal border-ink/20 hover:border-ink hover:-translate-y-0.5"
      }`}
    >
      <span
        className={`relative inline-block w-2 h-2 rounded-full ${
          isCurrent ? "bg-ember" : selected ? "bg-cream" : "bg-ink"
        }`}
      >
        {isCurrent && <span className="pulse-ring" />}
      </span>
      <span className="font-medium whitespace-nowrap max-w-[120px] truncate">
        {project.name}
      </span>
    </button>
  );
}
