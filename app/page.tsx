import FieldGuideShell from "@/components/FieldGuideShell";
import projectData from "@/data/drom-projects.json";
import type { ProjectData } from "@/types/project";

export default function Page() {
  return <FieldGuideShell data={projectData as ProjectData} />;
}
