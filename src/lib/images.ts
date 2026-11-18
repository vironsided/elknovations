// Responsive image URLs.
// - Supabase Storage images go through Vercel Image Optimization (`images` in vercel.json),
//   which resizes them and serves AVIF/WebP. Widths must be one of OPTIMIZER_WIDTHS,
//   the same list as `images.sizes` in vercel.json.
// - Unsplash images are resized by Unsplash's own CDN.
// - Anything else (and everything in `vite dev`) is used as-is.

export const OPTIMIZER_WIDTHS = [128, 256, 384, 640, 828, 1080, 1600, 2048] as const;

const storageHost = (() => {
  try {
    return new URL(String(import.meta.env.VITE_SUPABASE_URL ?? "")).host;
  } catch {
    return "";
  }
})();

const optimizerEnabled = import.meta.env.PROD;

function snapWidth(width: number): number {
  return OPTIMIZER_WIDTHS.find((w) => w >= width) ?? OPTIMIZER_WIDTHS[OPTIMIZER_WIDTHS.length - 1];
}

export function resizedImageUrl(src: string, width: number, quality = 75): string {
  if (!src) return src;
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  const w = snapWidth(width);
  if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("w", String(w));
    url.searchParams.set("q", String(quality));
    url.searchParams.set("auto", "format");
    return url.toString();
  }
  if (optimizerEnabled && storageHost && url.host === storageHost && url.pathname.startsWith("/storage/v1/object/public/")) {
    return `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;
  }
  return src;
}

/** `srcset` for the given candidate widths, or undefined when the image can't be resized. */
export function responsiveSrcSet(src: string, widths: number[], quality = 75): string | undefined {
  if (!src || resizedImageUrl(src, widths[0], quality) === src) return undefined;
  const unique = [...new Set(widths.map(snapWidth))];
  return unique.map((w) => `${resizedImageUrl(src, w, quality)} ${w}w`).join(", ");
}
