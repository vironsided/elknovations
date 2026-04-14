import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";

const PLATFORMS = [
  "Instagram",
  "X",
  "Twitter",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Pinterest",
  "WhatsApp",
  "Telegram",
  "Snapchat",
  "Threads",
] as const;

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
};

const empty: SocialLink = { id: "", platform: PLATFORMS[0], url: "", sort_order: 0 };

export function SocialLinksManager() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabaseConfigured) return;
    const { data } = await supabase.from("social_links").select("*").order("sort_order");
    if (data) setItems(data);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ ...empty, sort_order: items.length });
    setIsNew(true);
  }
  function startEdit(s: SocialLink) { setEditing({ ...s }); setIsNew(false); }
  function cancel() { setEditing(null); setIsNew(false); }

  async function save() {
    if (!editing || !editing.url.trim()) return;
    setSaving(true);
    if (isNew) {
      const { id: _id, ...rest } = editing;
      await supabase.from("social_links").insert(rest);
    } else {
      const { id, ...rest } = editing;
      await supabase.from("social_links").update(rest).eq("id", id);
    }
    setSaving(false);
    cancel();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this social link?")) return;
    await supabase.from("social_links").delete().eq("id", id);
    load();
  }

  const usedPlatforms = items.map((i) => i.platform);

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Social Links</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Add your social media profiles — they appear in the &ldquo;Follow us&rdquo; section
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Plus size={16} /> Add social
        </button>
      </div>

      {editing && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            {isNew ? "New Social Link" : "Edit Social Link"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Platform</label>
              <select
                value={editing.platform}
                onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              >
                {PLATFORMS.map((p) => {
                  const alreadyUsed = usedPlatforms.includes(p) && p !== editing.platform;
                  return (
                    <option key={p} value={p} disabled={alreadyUsed}>
                      {p}{alreadyUsed ? " (already added)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">URL</label>
              <input
                value={editing.url}
                onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                placeholder="https://instagram.com/yourpage"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
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
              disabled={saving || !editing.url.trim()}
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
          <p className="p-8 text-center text-sm text-neutral-500">
            No social links yet. Click &ldquo;Add social&rdquo; to get started.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {items.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-4 hover:bg-neutral-50">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-xs font-bold uppercase text-neutral-600">
                  {s.platform.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{s.platform}</p>
                  <p className="truncate text-sm text-neutral-500">{s.url}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(s)}
                    className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(s.id)}
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
