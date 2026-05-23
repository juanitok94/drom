export type ProjectStatus =
  | "completed"
  | "closed"
  | "under-construction"
  | "in-design"
  | "needs-confirmation";

export type Visibility = "prospect-safe" | "internal-review" | "internal-only";

export type SourceConfidence = "high" | "medium" | "low";

export type Sector =
  | "hospitality"
  | "coffee"
  | "restaurant-bar"
  | "commercial-upfit"
  | "residential"
  | "retail"
  | "millwork"
  | "unknown";

export type Corridor =
  | "haywood-road"
  | "downtown-asheville"
  | "river-arts-district"
  | "broadway"
  | "west-asheville"
  | "south-asheville"
  | "biltmore-village"
  | "unknown";

export interface Project {
  id: string;
  name: string;
  alternate_names?: string[];
  address: string | null;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  corridor: Corridor;
  lat: number | null;
  lng: number | null;
  status: ProjectStatus;
  visibility: Visibility;
  featured: boolean;
  public_visit: boolean;
  sector: Sector;
  project_type: string;
  categories: string[];
  drom_scope: string[];
  capabilities_shown: string[];
  prospect_relevance: string[];
  buyer_signal: string;
  public_summary: string;
  internal_notes: string;
  source_confidence: SourceConfidence;
  website: string | null;
  instagram: string | null;
  image_urls: string[];
}

export interface ProjectData {
  meta: {
    project: string;
    version: string;
    last_updated: string;
    description: string;
  };
  projects: Project[];
}

export type Mode = "internal" | "prospect";
export type MapView = "stylized" | "real";

export interface FilterState {
  category: string;
  search: string;
}
