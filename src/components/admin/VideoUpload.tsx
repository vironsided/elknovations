import { useEffect, useId, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Props {
  currentUrl?: string;
  onUploaded?: (url: string) => void;
  bucket?: string;
  folder?: string;
}

export function VideoUpload({
  currentUrl = "",
  onUploaded,
  bucket = "videos",
  folder = "transformations",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    setPreview(currentUrl);
  }, [currentUrl]);

  async function uploadFile(file: File) {
    const ext = file.name.split(".").pop() ?? "mp4";
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    try {
      const url = await uploadFile(selectedFile);
      setPreview(url);
      onUploaded?.(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Upload failed: " + message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleClear() {
    setPreview("");
    onUploaded?.("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          <video
            src={preview}
            controls
            preload="metadata"
            className="h-40 w-72 rounded-lg border border-neutral-200 bg-black object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white shadow hover:bg-red-600"
            aria-label="Remove video"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          <Upload size={16} />
          {uploading ? "Uploading…" : "Upload video"}
        </label>
        {preview ? (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            <X size={14} />
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
