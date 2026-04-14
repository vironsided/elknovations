import { useState } from "react";
import {
  CookingPot, Building2, Bath, Home, Paintbrush, Fence,
  Hammer, Wrench, HardHat, Ruler, BrickWall, TreePine,
  Lightbulb, Plug, Droplets, Thermometer, Wind, Sofa,
  DoorOpen, Key, Warehouse, PaintBucket, Scissors, Layers,
} from "lucide-react";

const iconEntries = [
  { name: "CookingPot", Icon: CookingPot },
  { name: "Building2", Icon: Building2 },
  { name: "Bath", Icon: Bath },
  { name: "Home", Icon: Home },
  { name: "Paintbrush", Icon: Paintbrush },
  { name: "Fence", Icon: Fence },
  { name: "Hammer", Icon: Hammer },
  { name: "Wrench", Icon: Wrench },
  { name: "HardHat", Icon: HardHat },
  { name: "Ruler", Icon: Ruler },
  { name: "BrickWall", Icon: BrickWall },
  { name: "TreePine", Icon: TreePine },
  { name: "Lightbulb", Icon: Lightbulb },
  { name: "Plug", Icon: Plug },
  { name: "Droplets", Icon: Droplets },
  { name: "Thermometer", Icon: Thermometer },
  { name: "Wind", Icon: Wind },
  { name: "Sofa", Icon: Sofa },
  { name: "DoorOpen", Icon: DoorOpen },
  { name: "Key", Icon: Key },
  { name: "Warehouse", Icon: Warehouse },
  { name: "PaintBucket", Icon: PaintBucket },
  { name: "Scissors", Icon: Scissors },
  { name: "Layers", Icon: Layers },
];

interface Props {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = iconEntries.find((e) => e.name === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
      >
        {current ? <current.Icon size={18} strokeWidth={1.5} /> : null}
        {value || "Pick icon"}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 grid w-72 grid-cols-6 gap-1 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
          {iconEntries.map((e) => (
            <button
              key={e.name}
              type="button"
              title={e.name}
              onClick={() => { onChange(e.name); setOpen(false); }}
              className={`flex items-center justify-center rounded-lg p-2 transition ${
                value === e.name
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <e.Icon size={20} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { iconEntries };
