import type { WorkCase } from "../../hooks/useSiteData";

type Props = { cases: WorkCase[] };

export function ProjectsSlider({ cases }: Props) {
  if (cases.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-500">
        No projects match your search.
      </p>
    );
  }
  return (
    <div className="text-sm text-neutral-600">
      {cases.length} projects loaded.
    </div>
  );
}
