import { useState, type ComponentPropsWithRef } from "react";
import { resizedImageUrl, responsiveSrcSet } from "../../lib/images";

type Props = Omit<ComponentPropsWithRef<"img">, "src" | "srcSet" | "sizes"> & {
  src: string;
  /** Candidate widths (px) for the srcset; the browser picks one using `sizes`. */
  widths: number[];
  /** Rendered width of the image, as in the HTML `sizes` attribute. */
  sizes: string;
};

/**
 * <img> that downloads a resized copy instead of the original upload.
 * Lazy by default. If the resized copy fails (e.g. the optimizer quota is used up),
 * it falls back to the original file.
 */
export function SmartImage({ src, widths, sizes, onError, loading = "lazy", decoding = "async", ...rest }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const srcSet = failedSrc === src ? undefined : responsiveSrcSet(src, widths);

  return (
    <img
      {...rest}
      loading={loading}
      decoding={decoding}
      src={srcSet ? resizedImageUrl(src, Math.max(...widths)) : src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      onError={(event) => {
        if (srcSet) {
          setFailedSrc(src);
          return;
        }
        onError?.(event);
      }}
    />
  );
}
