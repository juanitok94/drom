"use client";

import { useEffect } from "react";
import type { Mode, Project } from "@/types/project";
import {
  CORRIDOR_LABELS,
  SECTOR_LABELS,
  STATUS_LABELS,
  STATUS_TONE,
} from "@/lib/utils";
import SectorPattern from "./SectorPattern";

interface Props {
  project: Project | null;
  mode: Mode;
  onClose: () => void;
}

export default function ProjectDrawer({ project, mode, onClose }: Props) {
  // ESC to close
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [project, onClose]);

  const open = !!project;

  return (
    <>
      {/* Scrim */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 scrim" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[520px] bg-cream border-l border-ink/15 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        {project && <DrawerContent project={project} mode={mode} onClose={onClose} />}
      </aside>
    </>
  );
}

function DrawerContent({
  project,
  mode,
  onClose,
}: {
  project: Project;
  mode: Mode;
  onClose: () => void;
}) {
  const isInternal = mode === "internal";

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero / pattern */}
      <div className="relative aspect-[5/3] w-full">
        {project.image_urls.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_urls[0]}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <SectorPattern sector={project.sector} className="absolute inset-0" />
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center bg-cream/95 backdrop-blur-sm border border-ink/15 rounded-full hover:bg-cream hover:border-ink/40 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1 L13 13 M13 1 L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Status badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`label-caps inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-sm bg-cream/95 backdrop-blur-sm ${STATUS_TONE[project.status]}`}
          >
            {project.status === "under-construction" && (
              <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-ember">
                <span className="pulse-ring" />
              </span>
            )}
            {STATUS_LABELS[project.status]}
          </span>
          {isInternal && project.visibility !== "prospect-safe" && (
            <span className="label-caps px-2.5 py-1 bg-ink text-cream rounded-sm">
              {project.visibility === "internal-only" ? "Internal Only" : "Needs Review"}
            </span>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="px-7 pt-7 pb-5 border-b border-ink/10">
        <p className="label-caps text-stone mb-2">
          {CORRIDOR_LABELS[project.corridor]}
        </p>
        <h2 className="font-serif text-4xl leading-tight text-ink">
          {project.name}
        </h2>
        {project.alternate_names && project.alternate_names.length > 0 && (
          <p className="font-serif italic text-stone mt-1">
            also known as {project.alternate_names.join(", ")}
          </p>
        )}
        {project.address && (
          <p className="text-sm text-charcoal/80 mt-3 inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1 C3.5 1 1.5 3 1.5 5.5 C1.5 8.5 6 11 6 11 C6 11 10.5 8.5 10.5 5.5 C10.5 3 8.5 1 6 1 Z" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="6" cy="5.5" r="1.5" fill="currentColor" />
            </svg>
            {project.address}
          </p>
        )}
      </div>

      {/* Buyer signal — the marquee proof line */}
      {project.buyer_signal && (
        <div className="px-7 py-6 bg-paper border-b border-ink/10">
          <p className="label-caps text-stone mb-3">
            {mode === "prospect" ? "Why this matters" : "Buyer Signal"}
          </p>
          <p className="font-serif text-xl leading-snug text-ink">
            <span className="italic-accent text-ember">“</span>
            {project.buyer_signal}
            <span className="italic-accent text-ember">”</span>
          </p>
        </div>
      )}

      {/* Public summary */}
      {project.public_summary && (
        <Section title="Project">
          <p className="text-charcoal leading-relaxed">{project.public_summary}</p>
        </Section>
      )}

      {/* Sector / type meta grid */}
      <div className="px-7 py-5 grid grid-cols-2 gap-x-6 gap-y-4 border-b border-ink/10">
        <Meta label="Sector" value={SECTOR_LABELS[project.sector]} />
        <Meta label="Project Type" value={prettify(project.project_type)} />
        {project.drom_scope.length > 0 && (
          <Meta label="Dröm Scope" value={project.drom_scope.join(", ")} />
        )}
        {project.neighborhood && (
          <Meta label="Neighborhood" value={project.neighborhood} />
        )}
      </div>

      {/* Capabilities */}
      {project.capabilities_shown.length > 0 && (
        <Section title="Capabilities Shown">
          <div className="flex flex-wrap gap-2">
            {project.capabilities_shown.map((c) => (
              <span
                key={c}
                className="text-[12px] px-2.5 py-1 bg-paper border border-ink/15 text-charcoal"
              >
                {c}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Prospect relevance */}
      {project.prospect_relevance.length > 0 && (
        <Section title="Best For">
          <div className="flex flex-wrap gap-2">
            {project.prospect_relevance.map((c) => (
              <span
                key={c}
                className="text-[12px] px-2.5 py-1 bg-cream border border-brass/40 text-brass capitalize"
              >
                {c}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Internal-only fields */}
      {isInternal && (
        <div className="bg-ink text-cream">
          <div className="px-7 py-6 border-b border-cream/10">
            <p className="label-caps text-brass mb-3">Internal — Dröm Team Only</p>
            <h3 className="font-serif italic text-2xl text-cream mb-4">
              Notes & confirmations
            </h3>

            <div className="space-y-4 text-sm">
              {project.internal_notes && (
                <div>
                  <p className="label-caps text-cream/50 mb-1">Internal Notes</p>
                  <p className="text-cream/90 leading-relaxed">{project.internal_notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="label-caps text-cream/50 mb-1">Source Confidence</p>
                  <p className="text-cream/90 capitalize">{project.source_confidence}</p>
                </div>
                <div>
                  <p className="label-caps text-cream/50 mb-1">Visibility</p>
                  <p className="text-cream/90 capitalize">{project.visibility.replace(/-/g, " ")}</p>
                </div>
              </div>

              {needsConfirmationFields(project).length > 0 && (
                <div>
                  <p className="label-caps text-ember mb-2">Confirmation Needed</p>
                  <ul className="space-y-1">
                    {needsConfirmationFields(project).map((field) => (
                      <li key={field} className="flex items-start gap-2 text-cream/90">
                        <span className="text-ember mt-0.5">→</span>
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-7 py-6 border-t border-ink/10 text-stone font-serif italic text-sm">
        Each project is a proof point.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-7 py-5 border-b border-ink/10">
      <p className="label-caps text-stone mb-3">{title}</p>
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps text-stone mb-1">{label}</p>
      <p className="text-charcoal">{value}</p>
    </div>
  );
}

function prettify(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function needsConfirmationFields(p: Project): string[] {
  const fields: string[] = [];
  if (!p.address) fields.push("Address");
  if (!p.lat || !p.lng) fields.push("Coordinates / map pin");
  if (p.capabilities_shown.length === 0) fields.push("Capabilities shown");
  if (!p.buyer_signal) fields.push("Buyer signal language");
  if (!p.public_summary) fields.push("Public summary language");
  if (p.source_confidence === "low") fields.push("Project verification with Brian");
  if (p.image_urls.length === 0) fields.push("Project photography");
  return fields;
}
