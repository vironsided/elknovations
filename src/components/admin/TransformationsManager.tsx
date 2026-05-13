import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import { VideoUpload } from "./VideoUpload";

type Transformation = {
  id: string;
  src: string;
  title: string;
  description: string;
  tag: string;
  sort_order: number;
};

const empty: Omit<Transformation, "id"> = {
  src: "",
  title: "",
  description: "",
  tag: "Before → After",
  sort_order: 0,
};

export function TransformationsManager() {
  const [items, setItems] = useState<Transformation[]>([]);
  const [editing, setEditing] = useState<Transformation | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabaseConfigured) return;
    const { data } = await supabase.from("transformations").select("*").order("sort_order");
    if (data) setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({ id: "", ...empty, sort_order: items.length });
    setIsNew(true);
  }

  function startEdit(item: Transformation) {
    setEditing({ ...item });
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing || !editing.src.trim() || !editing.title.trim()) return;
    setSaving(true);
    if (isNew) {
      const { id: _id, ...rest } = editing;
      await supabase.from("transformations").insert(rest);
    } else {
      const { id, ...rest } = editing;
      await supabase.from("transformations").update(rest).eq("id", id);
    }
    setSaving(false);
    cancel();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this transformation video?")) return;
    await supabase.from("transformations").delete().eq("id", id);
    load();
  }

  function field(key: keyof Transformation, label: string, textarea = false) {
    if (!editing) return null;
    const value = String(editing[key] ?? "");
    const common =
      "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">{label}</label>
        {textarea ? (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
            className={common}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
            className={common}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Transformations</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage videos for the homepage transformations section</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Plus size={16} /> Add video
        </button>
      </div>

      {editing && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">{isNew ? "New video" : "Edit video"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Video file</label>
              <VideoUpload
                currentUrl={editing.src}
                onUploaded={(url) => setEditing({ ...editing, src: url })}
                bucket="videos"
                folder="transformations"
              />
              <p className="mt-2 truncate text-xs text-neutral-500">
                {editing.src ? `Uploaded URL: ${editing.src}` : "Upload a video file to continue."}
              </p>
            </div>
            {field("title", "Title")}
            {field("tag", "Tag")}
            <div className="sm:col-span-2">{field("description", "Description", true)}</div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Sort order</label>
              <input
                type="number"
                value={editing.sort_order}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                className="w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
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
          <p className="p-8 text-center text-sm text-neutral-500">No transformation videos yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-neutral-50">
                <GripVertical size={16} className="mt-1 shrink-0 text-neutral-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                  <p className="mt-1 truncate text-xs text-neutral-500">{item.src}</p>
                  <p className="mt-1 text-xs text-neutral-500">{item.tag}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
