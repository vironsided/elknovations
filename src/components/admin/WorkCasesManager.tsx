import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import { ImageUpload } from "./ImageUpload";

type WorkCategory = { id: string; name: string };
type WorkCase = {
  id: string;
  category_id: string | null;
  title: string;
  location: string;
  completed_at: string | null;
  summary: string;
  scope_details: string;
  materials: string;
  total_price_usd: number;
  before_image_url: string;
  after_image_url: string;
  latitude: number | null;
  longitude: number | null;
  sort_order: number;
};

const empty: Omit<WorkCase, "id"> = {
  category_id: null,
  title: "",
  location: "",
  completed_at: null,
  summary: "",
  scope_details: "",
  materials: "",
  total_price_usd: 0,
  before_image_url: "",
  after_image_url: "",
  latitude: null,
  longitude: null,
  sort_order: 0,
};

function parseCoord(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function WorkCasesManager() {
  const [items, setItems] = useState<WorkCase[]>([]);
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [editing, setEditing] = useState<WorkCase | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabaseConfigured) return;
    const [{ data: cases }, { data: cats }] = await Promise.all([
      supabase.from("work_cases").select("*").order("sort_order"),
      supabase.from("work_categories").select("id, name").order("sort_order"),
    ]);
    if (cases) setItems(cases);
    if (cats) setCategories(cats);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ id: "", ...empty, sort_order: items.length });
    setIsNew(true);
  }
  function startEdit(item: WorkCase) {
    setEditing({ ...item });
    setIsNew(false);
  }
  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing || !editing.title.trim()) return;
    setSaving(true);
    if (isNew) {
      const { id: _id, ...rest } = editing;
      await supabase.from("work_cases").insert(rest);
    } else {
      const { id, ...rest } = editing;
      await supabase.from("work_cases").update(rest).eq("id", id);
    }
    setSaving(false);
    cancel();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this work case?")) return;
    await supabase.from("work_cases").delete().eq("id", id);
    load();
  }

  function categoryName(id: string | null) {
    if (!id) return "Uncategorized";
    return categories.find((c) => c.id === id)?.name ?? "Uncategorized";
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Work cases</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage before/after portfolio items for /work</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Plus size={16} /> Add case
        </button>
      </div>

      {editing && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            {isNew ? "New work case" : "Edit work case"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Title</label>
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Category</label>
              <select
                value={editing.category_id ?? ""}
                onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Location</label>
              <input
                value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                placeholder="Ohio"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Completed date</label>
              <input
                type="date"
                value={editing.completed_at ?? ""}
                onChange={(e) => setEditing({ ...editing, completed_at: e.target.value || null })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Summary</label>
              <textarea
                value={editing.summary}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Work scope details</label>
              <textarea
                value={editing.scope_details}
                onChange={(e) => setEditing({ ...editing, scope_details: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Materials</label>
              <textarea
                value={editing.materials}
                onChange={(e) => setEditing({ ...editing, materials: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Price (USD)</label>
              <input
                type="number"
                min={0}
                value={editing.total_price_usd}
                onChange={(e) => setEditing({ ...editing, total_price_usd: Number(e.target.value) || 0 })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Sort order</label>
              <input
                type="number"
                value={editing.sort_order}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })}
                className="w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Latitude</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="40.712776"
                value={editing.latitude ?? ""}
                onChange={(e) => setEditing({ ...editing, latitude: parseCoord(e.target.value) })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Longitude</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="-74.005974"
                value={editing.longitude ?? ""}
                onChange={(e) => setEditing({ ...editing, longitude: parseCoord(e.target.value) })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div className="sm:col-span-2">
              <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
                Tip: open <a className="underline" href="https://www.google.com/maps" target="_blank" rel="noreferrer">Google Maps</a>,
                right-click the exact spot → click the decimal coordinates (e.g. <code>40.712776, -74.005974</code>) to copy, then paste the first number into Latitude and the second into Longitude.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Before image</label>
              <ImageUpload
                currentUrl={editing.before_image_url}
                onUploaded={(url) => setEditing({ ...editing, before_image_url: url })}
                folder="work-cases/before"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">After image</label>
              <ImageUpload
                currentUrl={editing.after_image_url}
                onUploaded={(url) => setEditing({ ...editing, after_image_url: url })}
                folder="work-cases/after"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              <Save size={16} /> {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={cancel}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-500">No work cases yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="w-8 px-4 py-3 text-left font-medium text-neutral-600" />
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Title</th>
                <th className="hidden px-4 py-3 text-left font-medium text-neutral-600 sm:table-cell">Category</th>
                <th className="hidden px-4 py-3 text-left font-medium text-neutral-600 md:table-cell">Location</th>
                <th className="w-28 px-4 py-3 text-right font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 text-neutral-400"><GripVertical size={16} /></td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{item.title}</td>
                  <td className="hidden px-4 py-3 text-neutral-600 sm:table-cell">{categoryName(item.category_id)}</td>
                  <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">{item.location || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="rounded-lg p-1.5 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
