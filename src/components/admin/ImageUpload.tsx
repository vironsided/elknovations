import { useId, useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Props {
  currentUrl: string;
  onUploaded: (url: string) => void;
  bucket?: string;
  folder?: string;
}

export function ImageUpload({ currentUrl, onUploaded, bucket = "images", folder = "uploads" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function handleFile(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    const url = urlData.publicUrl;
    setPreview(url);
    onUploaded(url);
    setUploading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleClear() {
    setPreview("");
    onUploaded("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-48 rounded-lg border border-neutral-200 object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white shadow hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          <Upload size={16} />
          {uploading ? "Uploading…" : "Upload image"}
        </label>
      </div>
    </div>
  );
}
