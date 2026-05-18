import { useEffect, useMemo, useState } from "react";
import { Download, FileImage, FileType2, FileText, Lock, Unlock } from "lucide-react";
import QRCodeLib from "qrcode";

const DEFAULT_URL = "https://www.elknovations.com/";
const MIN_SIZE = 200;
const MAX_SIZE = 1024;

type Format = "png" | "svg" | "pdf";
type Preset = { id: string; label: string; size: number; hint: string };

const PRESETS: Preset[] = [
  { id: "business-card", label: "Business card", size: 360, hint: "Good balance for card print quality." },
  { id: "car-sticker", label: "Car sticker", size: 600, hint: "Sharper and easier to scan from distance." },
  { id: "a4-flyer", label: "A4 print", size: 900, hint: "High-resolution for full page print." },
];

function safeSize(value: number): number {
  if (!Number.isFinite(value)) return 320;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)));
}

export function QrGenerator() {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [size, setSize] = useState(360);
  const [urlLocked, setUrlLocked] = useState(true);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState<Format | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finalSize = useMemo(() => safeSize(size), [size]);
  const trimmedUrl = useMemo(() => url.trim(), [url]);

  useEffect(() => {
    let cancelled = false;
    if (!trimmedUrl) {
      setPreviewDataUrl("");
      return;
    }
    QRCodeLib.toDataURL(trimmedUrl, { width: finalSize, margin: 1 })
      .then((data) => {
        if (!cancelled) setPreviewDataUrl(data);
      })
      .catch(() => {
        if (!cancelled) setPreviewDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [trimmedUrl, finalSize]);

  function fileBaseName() {
    return "elknovations-qr-code";
  }

  function triggerDownload(data: string, filename: string) {
    const a = document.createElement("a");
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function downloadPng() {
    setDownloading("png");
    setError(null);
    try {
      const dataUrl = await QRCodeLib.toDataURL(url.trim(), {
        width: finalSize,
        margin: 1,
      });
      triggerDownload(dataUrl, `${fileBaseName()}.png`);
    } catch {
      setError("Could not generate PNG. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  async function downloadSvg() {
    setDownloading("svg");
    setError(null);
    try {
      const svg = await QRCodeLib.toString(url.trim(), {
        type: "svg",
        width: finalSize,
        margin: 1,
      });
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const dataUrl = URL.createObjectURL(blob);
      triggerDownload(dataUrl, `${fileBaseName()}.svg`);
      URL.revokeObjectURL(dataUrl);
    } catch {
      setError("Could not generate SVG. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  async function downloadPdf() {
    setDownloading("pdf");
    setError(null);
    try {
      const pngDataUrl = await QRCodeLib.toDataURL(url.trim(), {
        width: finalSize,
        margin: 1,
      });

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const qrSize = Math.min(320, finalSize);
      const x = (pageWidth - qrSize) / 2;
      const y = (pageHeight - qrSize) / 2 - 40;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Elk Novations QR Code", pageWidth / 2, y - 22, { align: "center" });
      doc.addImage(pngDataUrl, "PNG", x, y, qrSize, qrSize);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(url.trim(), pageWidth / 2, y + qrSize + 20, { align: "center", maxWidth: pageWidth - 80 });
      doc.save(`${fileBaseName()}.pdf`);
    } catch {
      setError("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="p-6 lg:p-10">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">QR Generator</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Generate a QR code for business cards and vehicle stickers, then download it in different formats.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <label className="mb-1 block text-xs font-medium text-neutral-600">Destination URL</label>
          <div className="flex gap-2">
            <input
              value={url}
              disabled={urlLocked}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-500"
              placeholder="https://www.elknovations.com/"
            />
            <button
              type="button"
              onClick={() => setUrlLocked((v) => !v)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              {urlLocked ? <Lock size={14} /> : <Unlock size={14} />}
              {urlLocked ? "Locked" : "Unlocked"}
            </button>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {urlLocked
              ? "URL is locked to avoid accidental changes."
              : "URL is editable. Lock it again when done."}
          </p>

          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-neutral-600">Print Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSize(preset.size)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    finalSize === preset.size
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              {PRESETS.find((p) => p.size === finalSize)?.hint ??
                "Custom size selected for specific print needs."}
            </p>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-neutral-600">QR Size (px)</label>
            <input
              type="number"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={size}
              onChange={(e) => setSize(Number(e.target.value) || 320)}
              className="w-36 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Recommended: 300-600 px for stickers and business cards.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={downloadPng}
              disabled={!url.trim() || downloading !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              <FileImage size={16} />
              {downloading === "png" ? "Generating..." : "Download PNG"}
            </button>
            <button
              onClick={downloadSvg}
              disabled={!url.trim() || downloading !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60"
            >
              <FileType2 size={16} />
              {downloading === "svg" ? "Generating..." : "Download SVG"}
            </button>
            <button
              onClick={downloadPdf}
              disabled={!url.trim() || downloading !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60"
            >
              <FileText size={16} />
              {downloading === "pdf" ? "Generating..." : "Download PDF"}
            </button>
          </div>

          <p className="mt-4 text-xs text-neutral-500">
            Tip: For print, SVG is best for sharp quality at any size.
          </p>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <Download size={16} />
            QR Preview
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <div className="mx-auto w-fit rounded-lg bg-white p-3 shadow-sm">
              {url.trim() ? (
                <img
                  src={previewDataUrl}
                  width={finalSize}
                  height={finalSize}
                  alt="QR preview"
                  className="block"
                />
              ) : (
                <div className="grid h-[260px] w-[260px] place-items-center text-sm text-neutral-500">
                  Enter a URL to generate a QR code.
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-neutral-500 break-all">Encoded URL: {url.trim() || "-"}</p>
        </div>
      </div>
    </div>
  );
}
