import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";

type WorkCategory = { id: string; name: string; slug: string; sort_order: number };

export function WorkCategoriesManager() {
  const [items, setItems] = useState<WorkCategory[]>([]);
  const [editing, setEditing] = useState<WorkCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabaseConfigured) return;
    const { data } = await supabase.from("work_categories").select("*").order("sort_order");
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function startNew() {
    setEditing({ id: "", name: "", slug: "", sort_order: items.length });
    setIsNew(true);
  }
  function startEdit(c: WorkCategory) { setEditing({ ...c }); setIsNew(false); }
  function cancel() { setEditing(null); setIsNew(false); }

  async function save() {
    if (!editing || !editing.name.trim()) return;
    const payload = { ...editing, slug: slugify(editing.slug || editing.name) };
    setSaving(true);
    if (isNew) {
      const { id: _id, ...rest } = payload;
      await supabase.from("work_categories").insert(rest);
    } else {
      const { id, ...rest } = payload;
      await supabase.from("work_categories").update(rest).eq("id", id);
    }
    setSaving(false);
    cancel();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Existing work items will become uncategorized.")) return;
    await supabase.from("work_categories").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Work categories</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage filters for the /work page</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
          <Plus size={16} /> Add category
        </button>
      </div>

      {editing && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">{isNew ? "New category" : "Edit category"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Name</label>
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Slug</label>
              <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="bathroom" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Sort order</label>
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900" />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60">
              <Save size={16} /> {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={cancel} className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-500">No categories yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {items.map((c) => (
              <div key={c.id} className="flex items-start gap-3 px-5 py-4 hover:bg-neutral-50">
                <GripVertical size={16} className="mt-1 shrink-0 text-neutral-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{c.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">/{c.slug}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => startEdit(c)} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"><Pencil size={16} /></button>
                  <button onClick={() => remove(c.id)} className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
