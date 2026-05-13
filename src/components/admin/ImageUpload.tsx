import { useEffect, useId, useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Props {
  currentUrl?: string;
  onUploaded?: (url: string) => void;
  currentUrls?: string[];
  onUploadedUrls?: (urls: string[]) => void;
  multiple?: boolean;
  bucket?: string;
  folder?: string;
}

export function ImageUpload({
  currentUrl = "",
  onUploaded,
  currentUrls,
  onUploadedUrls,
  multiple = false,
  bucket = "images",
  folder = "uploads",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(
    multiple ? (currentUrls ?? []).filter(Boolean) : currentUrl ? [currentUrl] : [],
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (multiple) {
      setPreviews((currentUrls ?? []).filter(Boolean));
      return;
    }
    setPreviews(currentUrl ? [currentUrl] : []);
  }, [currentUrl, currentUrls, multiple]);

  function emit(next: string[]) {
    setPreviews(next);
    onUploadedUrls?.(next);
    onUploaded?.(next[0] ?? "");
  }

  async function uploadFile(file: File, index = 0) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${Date.now()}-${index}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      throw new Error(error.message);
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const files = multiple ? selectedFiles : [selectedFiles[0]];
      const uploaded = await Promise.all(files.map((file, index) => uploadFile(file, index)));
      const next = multiple ? [...previews, ...uploaded] : uploaded.slice(0, 1);
      emit(next);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Upload failed: " + message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleClearAt(index: number) {
    const next = previews.filter((_, i) => i !== index);
    emit(next);
  }

  function handleClearAll() {
    emit([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {previews.length > 0 ? (
        <div className={multiple ? "grid grid-cols-2 gap-2" : "relative inline-block"}>
          {previews.map((preview, index) => (
            <div key={`${preview}-${index}`} className="relative">
              <img
                src={preview}
                alt="Preview"
                className={multiple
                  ? "h-28 w-full rounded-lg border border-neutral-200 object-cover"
                  : "h-32 w-48 rounded-lg border border-neutral-200 object-cover"}
              />
              <button
                type="button"
                onClick={() => handleClearAt(index)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white shadow hover:bg-red-600"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          id={inputId}
        />
        <div className="flex flex-wrap items-center gap-2">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <Upload size={16} />
            {uploading ? "Uploading…" : multiple ? "Upload image(s)" : "Upload image"}
          </label>
          {previews.length > 0 ? (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
            >
              <X size={14} />
              Clear all
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
