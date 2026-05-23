import type { Corridor, Project, ProjectStatus, Sector } from "@/types/project";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  completed: "Completed",
  "under-construction": "Current Build",
  "in-design": "In Design",
  "needs-confirmation": "Needs Confirmation",
};

export const STATUS_TONE: Record<ProjectStatus, string> = {
  completed: "bg-bone text-ink border-ink/15",
  "under-construction": "bg-ember/10 text-ember border-ember/30",
  "in-design": "bg-brass/15 text-brass border-brass/40",
  "needs-confirmation": "bg-mist/20 text-stone border-stone/30",
};

export const SECTOR_LABELS: Record<Sector, string> = {
  hospitality: "Hospitality",
  coffee: "Coffee + Cafe",
  "restaurant-bar": "Restaurant + Bar",
  "commercial-upfit": "Commercial Up-fit",
  residential: "Residential",
  retail: "Retail",
  millwork: "Millwork",
  unknown: "Sector TBD",
};

export const CORRIDOR_LABELS: Record<Corridor, string> = {
  "haywood-road": "Haywood Road",
  "downtown-asheville": "Downtown",
  "river-arts-district": "River Arts District",
  broadway: "Broadway",
  "west-asheville": "West Asheville",
  "south-asheville": "South Asheville",
  "biltmore-village": "Biltmore Village",
  unknown: "Needs Confirmation",
};

// Stylized canvas anchor positions per corridor (percent of canvas)
export const CORRIDOR_POSITIONS: Record<
  Corridor,
  { x: number; y: number; label: string }
> = {
  "haywood-road": { x: 22, y: 52, label: "Haywood Road" },
  "west-asheville": { x: 22, y: 52, label: "West Asheville" },
  "downtown-asheville": { x: 55, y: 38, label: "Downtown" },
  broadway: { x: 58, y: 32, label: "Broadway" },
  "river-arts-district": { x: 48, y: 62, label: "River Arts District" },
  "south-asheville": { x: 62, y: 78, label: "South Asheville" },
  "biltmore-village": { x: 70, y: 70, label: "Biltmore Village" },
  unknown: { x: 85, y: 88, label: "Needs Confirmation" },
};

export const FILTERS: { id: string; label: string; predicate: (p: Project) => boolean }[] =
  [
    { id: "all", label: "All", predicate: () => true },
    { id: "featured", label: "Featured", predicate: (p) => p.featured },
    {
      id: "current-build",
      label: "Current Builds",
      predicate: (p) => p.status === "under-construction",
    },
    {
      id: "hospitality",
      label: "Hospitality",
      predicate: (p) => p.categories.includes("hospitality"),
    },
    {
      id: "coffee",
      label: "Coffee + Cafe",
      predicate: (p) => p.categories.includes("coffee"),
    },
    {
      id: "restaurant-bar",
      label: "Restaurant + Bar",
      predicate: (p) => p.categories.includes("restaurant-bar"),
    },
    {
      id: "commercial-upfit",
      label: "Commercial Up-fit",
      predicate: (p) => p.categories.includes("commercial-upfit"),
    },
    {
      id: "residential",
      label: "Residential",
      predicate: (p) => p.categories.includes("residential"),
    },
    {
      id: "haywood-road",
      label: "Haywood Road",
      predicate: (p) => p.corridor === "haywood-road",
    },
    {
      id: "downtown",
      label: "Downtown",
      predicate: (p) =>
        p.corridor === "downtown-asheville" || p.corridor === "broadway",
    },
    {
      id: "rad",
      label: "River Arts District",
      predicate: (p) => p.corridor === "river-arts-district",
    },
    {
      id: "needs-confirmation",
      label: "Needs Confirmation",
      predicate: (p) =>
        p.status === "needs-confirmation" || p.source_confidence === "low",
    },
  ];

export function searchProjects(projects: Project[], query: string): Project[] {
  if (!query.trim()) return projects;
  const q = query.toLowerCase();
  return projects.filter((p) => {
    const haystack = [
      p.name,
      ...(p.alternate_names || []),
      p.address || "",
      p.neighborhood || "",
      p.public_summary,
      p.buyer_signal,
      p.internal_notes,
      ...p.capabilities_shown,
      ...p.prospect_relevance,
      ...p.categories,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function toCSV(projects: Project[]): string {
  const headers = [
    "id",
    "name",
    "address",
    "neighborhood",
    "corridor",
    "status",
    "sector",
    "visibility",
    "featured",
    "source_confidence",
    "capabilities_shown",
    "buyer_signal",
    "public_summary",
    "internal_notes",
  ];
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const rows = projects.map((p) =>
    [
      p.id,
      p.name,
      p.address,
      p.neighborhood,
      p.corridor,
      p.status,
      p.sector,
      p.visibility,
      p.featured,
      p.source_confidence,
      p.capabilities_shown.join("; "),
      p.buyer_signal,
      p.public_summary,
      p.internal_notes,
    ]
      .map(escape)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function groupByCorridor(projects: Project[]): Record<Corridor, Project[]> {
  const groups = {} as Record<Corridor, Project[]>;
  for (const p of projects) {
    (groups[p.corridor] ||= []).push(p);
  }
  return groups;
}
