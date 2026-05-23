"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { MapView, Mode, Project, ProjectData } from "@/types/project";
import { FILTERS, downloadFile, searchProjects, toCSV } from "@/lib/utils";
import FilterBar from "./FilterBar";
import ModeToggle from "./ModeToggle";
import ProjectCard from "./ProjectCard";
import ProjectDrawer from "./ProjectDrawer";
import SearchInput from "./SearchInput";
import StatsBar from "./StatsBar";
import StylizedMap from "./StylizedMap";

// Leaflet must be client-only (touches `window`)
const RealMap = dynamic(() => import("./RealMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-paper flex items-center justify-center text-stone font-serif italic">
      Loading map…
    </div>
  ),
});

interface Props {
  data: ProjectData;
}

export default function FieldGuideShell({ data }: Props) {
  const [mode, setMode] = useState<Mode>("internal");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapView, setMapView] = useState<MapView>("stylized");
  const [hydrated, setHydrated] = useState(false);

  // Read URL state once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    if (m === "internal" || m === "prospect") setMode(m);
    const f = params.get("filter");
    if (f && FILTERS.some((x) => x.id === f)) setActiveFilter(f);
    const q = params.get("q");
    if (q) setSearch(q);
    const v = params.get("view");
    if (v === "stylized" || v === "real") setMapView(v);
    const id = params.get("project");
    if (id && data.projects.some((p) => p.id === id)) setSelectedId(id);
    setHydrated(true);
  }, [data.projects]);

  // Sync state -> URL
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (mode !== "internal") params.set("mode", mode);
    if (activeFilter !== "all") params.set("filter", activeFilter);
    if (search) params.set("q", search);
    if (mapView !== "stylized") params.set("view", mapView);
    if (selectedId) params.set("project", selectedId);
    const qs = params.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [mode, activeFilter, search, mapView, selectedId, hydrated]);

  // Apply prospect-mode visibility filter
  const visibleProjects = useMemo(() => {
    if (mode === "internal") return data.projects;
    return data.projects.filter((p) => p.visibility === "prospect-safe");
  }, [data.projects, mode]);

  // Active filter
  const filterFn = useMemo(
    () => FILTERS.find((f) => f.id === activeFilter)?.predicate ?? (() => true),
    [activeFilter]
  );

  const filtered = useMemo(() => {
    const after = visibleProjects.filter(filterFn);
    return searchProjects(after, search);
  }, [visibleProjects, filterFn, search]);

  // Filter counts (respect current mode visibility but not the current filter)
  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const f of FILTERS) {
      out[f.id] = visibleProjects.filter(f.predicate).length;
    }
    return out;
  }, [visibleProjects]);

  const selected = useMemo(
    () => data.projects.find((p) => p.id === selectedId) ?? null,
    [data.projects, selectedId]
  );

  const handleExport = useCallback(
    (format: "json" | "csv") => {
      const filename = `drom-field-guide-${activeFilter}-${new Date()
        .toISOString()
        .slice(0, 10)}.${format}`;
      if (format === "json") {
        downloadFile(filename, JSON.stringify({ meta: data.meta, projects: filtered }, null, 2), "application/json");
      } else {
        downloadFile(filename, toCSV(filtered), "text/csv");
      }
    },
    [filtered, activeFilter, data.meta]
  );

  return (
    <main className="min-h-screen bg-cream">
      {/* Header — humane: one breath, no noise */}
      <header className="border-b border-ink/10 paper-grain">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">

          {/* Top utility bar — quiet, functional */}
          <div className="flex items-center justify-between py-3 border-b border-ink/[0.06]">
            <span className="label-caps text-stone text-[10px]">
              Dröm Construction · Asheville, NC
            </span>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                mode === "internal" ? "text-charcoal" : "text-stone"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  mode === "internal" ? "bg-ember" : "bg-moss"
                }`} />
                {mode === "internal" ? "Team view" : "Guest view"}
              </span>
              <ModeToggle mode={mode} onChange={setMode} />
            </div>
          </div>

          {/* Wordmark + live count */}
          <div className="py-6 md:py-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[0.92] text-ink tracking-tight">
                  Dröm <span className="italic-accent text-ember">Field</span> Guide
                </h1>
                <p className="mt-2.5 text-stone font-sans text-sm leading-snug">
                  Built work across Asheville and{" "}
                  <span className="italic-accent">Western North Carolina.</span>
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-serif text-5xl md:text-6xl leading-none text-ink">
                  {filtered.length}
                </p>
                <p className="label-caps text-stone mt-1">
                  {filtered.length === 1 ? "project" : "projects"}
                  {activeFilter !== "all" && (
                    <span className="text-ember"> · {currentFilterLabel(activeFilter)}</span>
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Subtle stats strip — info without weight */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-5">
        <div className="flex items-center gap-4 text-[11px] flex-wrap">
          {[
            { label: "completed", value: visibleProjects.filter(p => p.status === "completed").length },
            { label: "current build", value: visibleProjects.filter(p => p.status === "under-construction").length, accent: true },
            { label: "closed", value: visibleProjects.filter(p => p.status === "closed").length },
            { label: "needs confirmation", value: visibleProjects.filter(p => p.status === "needs-confirmation" || p.source_confidence === "low").length },
          ].filter(s => s.value > 0).map((s, i) => (
            <span key={s.label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-ink/15">·</span>}
              <span className={`font-serif text-lg leading-none ${s.accent ? "text-ember" : "text-ink"}`}>
                {s.value}
              </span>
              <span className="label-caps text-stone">{s.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-5 pb-4 flex items-center gap-4 flex-wrap">
        <div className="w-full md:w-[320px]">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div className="flex-1 min-w-[280px]">
          <FilterBar active={activeFilter} onChange={setActiveFilter} counts={counts} />
        </div>

        <div className="flex items-center gap-2">
          {/* Map view toggle */}
          <div className="inline-flex p-1 bg-paper border border-ink/15 rounded-full">
            {(["stylized", "real"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMapView(v)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-colors ${
                  mapView === v
                    ? "bg-ink text-cream"
                    : "text-stone hover:text-ink"
                }`}
              >
                {v === "stylized" ? "Field" : "Map"}
              </button>
            ))}
          </div>

          {/* Export */}
          <ExportMenu onExport={handleExport} />
        </div>
      </div>

      {/* Map */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="relative h-[480px] w-full border border-ink/10 overflow-hidden">
          {mapView === "stylized" ? (
            <StylizedMap
              projects={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <RealMap
              projects={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>
      </div>

      {/* Index */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-10 pb-20">
        <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-3 mb-6">
          <p className="label-caps text-stone">
            The Index
            {activeFilter !== "all" && (
              <span className="text-ember"> · {currentFilterLabel(activeFilter)}</span>
            )}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState onReset={() => { setActiveFilter("all"); setSearch(""); }} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 40, 320)}ms`, animationFillMode: "backwards" }}
              >
                <ProjectCard
                  project={p}
                  mode={mode}
                  active={selectedId === p.id}
                  onClick={() => setSelectedId(p.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/10 py-6">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-4 flex-wrap">
          <span className="font-serif italic text-stone text-sm">
            Each project is a proof point.
          </span>
          <div className="flex items-center gap-4 label-caps text-[10px] text-mist">
            <span>Updated {data.meta.last_updated}</span>
            <span>·</span>
            <span>Dröm Construction</span>
            <span>·</span>
            <span>Photos by Andy Wickstrom</span>
          </div>
        </div>
      </footer>

      <ProjectDrawer project={selected} mode={mode} onClose={() => setSelectedId(null)} />
    </main>
  );
}

function currentFilterLabel(id: string) {
  const f = FILTERS.find((x) => x.id === id);
  return f ? f.label : id;
}

function ExportMenu({ onExport }: { onExport: (format: "json" | "csv") => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-ink/15 rounded-full text-[12px] font-medium text-charcoal hover:border-ink/40 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1 L6 8 M3 5 L6 8 L9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M2 10 L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Export
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-cream border border-ink/15 shadow-lg rounded-sm overflow-hidden z-30 min-w-[140px] animate-scale-in">
          <button
            onClick={() => { onExport("json"); setOpen(false); }}
            className="block w-full text-left px-3 py-2 text-[12px] hover:bg-paper"
          >
            Download JSON
          </button>
          <button
            onClick={() => { onExport("csv"); setOpen(false); }}
            className="block w-full text-left px-3 py-2 text-[12px] hover:bg-paper border-t border-ink/10"
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="border border-dashed border-ink/15 py-16 text-center">
      <p className="font-serif italic text-2xl text-stone mb-2">Nothing here yet.</p>
      <p className="text-charcoal/70 text-sm mb-5">
        Try a different filter, clear the search, or add more projects to the JSON.
      </p>
      <button
        onClick={onReset}
        className="text-[12px] label-caps text-ember hover:text-ink transition-colors"
      >
        Reset filters →
      </button>
    </div>
  );
}
