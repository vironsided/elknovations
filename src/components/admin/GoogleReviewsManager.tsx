import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";
import { supabase, supabaseConfigured } from "../../lib/supabase";

type GoogleReview = {
  id: string;
  author_name: string;
  author_initial: string;
  rating: number;
  review_text: string;
  review_date: string;
  avatar_color: string;
  sort_order: number;
};

const empty: Omit<GoogleReview, "id"> = {
  author_name: "",
  author_initial: "",
  rating: 5,
  review_text: "",
  review_date: "",
  avatar_color: "",
  sort_order: 0,
};

function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < clamped
              ? "fill-yellow-400 text-yellow-400"
              : "fill-neutral-200 text-neutral-200"
          }
        />
      ))}
    </div>
  );
}

export function GoogleReviewsManager() {
  const [items, setItems] = useState<GoogleReview[]>([]);
  const [editing, setEditing] = useState<GoogleReview | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!supabaseConfigured) return;
    const { data } = await supabase
      .from("google_reviews")
      .select("*")
      .order("sort_order");
    if (data) setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({ id: "", ...empty, sort_order: items.length });
    setIsNew(true);
  }
  function startEdit(t: GoogleReview) {
    setEditing({ ...t });
    setIsNew(false);
  }
  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  async function save() {
    if (!editing || !editing.author_name.trim()) return;
    setSaving(true);
    const payload = {
      ...editing,
      author_initial: (editing.author_initial || editing.author_name || "?")
        .trim()
        .slice(0, 1)
        .toUpperCase(),
      rating: Math.max(1, Math.min(5, Number(editing.rating) || 5)),
    };
    if (isNew) {
      const { id: _id, ...rest } = payload;
      await supabase.from("google_reviews").insert(rest);
    } else {
      const { id, ...rest } = payload;
      await supabase.from("google_reviews").update(rest).eq("id", id);
    }
    setSaving(false);
    cancel();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    await supabase.from("google_reviews").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Google-style reviews</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Shown in the "See work near you" drawer. Enter the same info you see on Google — you can later
            swap to the Google Places API without changing the UI.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Plus size={16} /> Add review
        </button>
      </div>

      {editing && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            {isNew ? "New review" : "Edit review"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Author name</label>
              <input
                value={editing.author_name}
                onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Initial (1 char)</label>
              <input
                value={editing.author_initial}
                maxLength={1}
                placeholder="Auto from name"
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    author_initial: e.target.value.slice(0, 1),
                  })
                }
                className="w-24 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={editing.rating}
                onChange={(e) =>
                  setEditing({ ...editing, rating: Number(e.target.value) || 5 })
                }
                className="w-24 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Review date</label>
              <input
                value={editing.review_date}
                placeholder="2 months ago"
                onChange={(e) => setEditing({ ...editing, review_date: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-600">Review text</label>
              <textarea
                value={editing.review_text}
                onChange={(e) => setEditing({ ...editing, review_text: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Avatar color (hex, optional)
              </label>
              <input
                value={editing.avatar_color}
                placeholder="#1a73e8"
                onChange={(e) => setEditing({ ...editing, avatar_color: e.target.value })}
                className="w-40 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Sort order</label>
              <input
                type="number"
                value={editing.sort_order}
                onChange={(e) =>
                  setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })
                }
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
          <p className="p-8 text-center text-sm text-neutral-500">No reviews yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {items.map((r) => (
              <div key={r.id} className="flex items-start gap-3 px-5 py-4 hover:bg-neutral-50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900">
                      {r.author_name}
                    </p>
                    <Stars rating={r.rating} />
                    {r.review_date && (
                      <span className="text-xs text-neutral-400">{r.review_date}</span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                    {r.review_text}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => startEdit(r)}
                    className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(r.id)}
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
