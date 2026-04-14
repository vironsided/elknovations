import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";
import { ImageUpload } from "./ImageUpload";

type Project = {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  quote: string;
  author: string;
  image_url: string;
  theme: string;
  sort_order: number;
};

const empty: Omit<Project, "id"> = {
  title: "",
  category: "",
  duration: "",
  description: "",
  quote: "",
  author: "",
  image_url: "",
  theme: "light",
  sort_order: 0,
};

export function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabaseConfigured) return;
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ id: "", ...empty, sort_order: items.length });
    setIsNew(true);
  }

  function startEdit(p: Project) {
    setEditing({ ...p });
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      const { id: _id, ...rest } = editing;
      await supabase.from("projects").insert(rest);
    } else {
      const { id, ...rest } = editing;
      await supabase.from("projects").update(rest).eq("id", id);
    }
    setSaving(false);
    cancel();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  }

  function field(key: keyof Project, label: string, textarea = false) {
    if (!editing) return null;
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">{label}</label>
        {textarea ? (
          <textarea
            value={String(editing[key])}
            onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
        ) : (
          <input
            value={String(editing[key])}
            onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage showcase projects</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Plus size={16} /> Add project
        </button>
      </div>

      {editing && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            {isNew ? "New project" : "Edit project"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("title", "Title")}
            {field("category", "Category")}
            {field("duration", "Duration")}
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Theme</label>
              <select
                value={editing.theme}
                onChange={(e) => setEditing({ ...editing, theme: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="sm:col-span-2">{field("description", "Description", true)}</div>
            <div className="sm:col-span-2">{field("quote", "Client quote", true)}</div>
            {field("author", "Quote author")}
            {field("sort_order", "Sort order")}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Image</label>
              <ImageUpload
                currentUrl={editing.image_url}
                onUploaded={(url) => setEditing({ ...editing, image_url: url })}
                folder="projects"
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
          <p className="p-8 text-center text-sm text-neutral-500">No projects yet. Add one above.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-neutral-600 w-8"></th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Title</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600 hidden md:table-cell">Duration</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 text-neutral-400"><GripVertical size={16} /></td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{p.title}</td>
                  <td className="px-4 py-3 text-neutral-600 hidden sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3 text-neutral-500 hidden md:table-cell">{p.duration}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded-lg p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
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
