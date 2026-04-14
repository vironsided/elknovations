import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";

type Testimonial = { id: string; name: string; text: string; sort_order: number };

export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabaseConfigured) return;
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ id: "", name: "", text: "", sort_order: items.length });
    setIsNew(true);
  }
  function startEdit(t: Testimonial) { setEditing({ ...t }); setIsNew(false); }
  function cancel() { setEditing(null); setIsNew(false); }

  async function save() {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      const { id: _id, ...rest } = editing;
      await supabase.from("testimonials").insert(rest);
    } else {
      const { id, ...rest } = editing;
      await supabase.from("testimonials").update(rest).eq("id", id);
    }
    setSaving(false);
    cancel();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Testimonials</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage client reviews</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
          <Plus size={16} /> Add testimonial
        </button>
      </div>

      {editing && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">{isNew ? "New testimonial" : "Edit testimonial"}</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Client name</label>
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Review text</label>
              <textarea value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} rows={3} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
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
          <p className="p-8 text-center text-sm text-neutral-500">No testimonials yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {items.map((t) => (
              <div key={t.id} className="flex items-start gap-3 px-5 py-4 hover:bg-neutral-50">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                  <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{t.text}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => startEdit(t)} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"><Pencil size={16} /></button>
                  <button onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
