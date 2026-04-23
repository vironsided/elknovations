import type { WorkCase } from "../../hooks/useSiteData";

type Props = { cases: WorkCase[] };

export function WorkMap({ cases }: Props) {
  return (
    <div className="flex h-full min-h-[360px] items-center justify-center bg-neutral-100 text-sm text-neutral-500">
      {cases.length === 0
        ? "Add coordinates to projects in the admin panel to see them on the map."
        : `${cases.length} pinned location${cases.length === 1 ? "" : "s"}`}
    </div>
  );
}
