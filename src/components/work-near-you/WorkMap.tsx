import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Crosshair } from "lucide-react";
import L, { type LatLngExpression, type LatLngTuple } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import type { WorkCase } from "../../hooks/useSiteData";

type Props = {
  cases: WorkCase[];
  /** When user taps a map pin, scrolls the project card in the left column into view. */
  onMarkerClickId?: (id: string) => void;
};

function pinIcon(n: number) {
  const html = `<div class="wny-map-pin-bubble" style="box-sizing:border-box;width:40px;height:40px;border-radius:10px;border:2px solid #fff;background:linear-gradient(180deg,#f97316 0%,#ea580c 100%);box-shadow:0 4px 12px rgba(0,0,0,0.25);color:#fff;font-weight:800;font-size:15px;font-family:ui-sans-serif,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;line-height:1">${n}</div>`;
  return L.divIcon({
    className: "wny-map-pin",
    html,
    iconSize: [40, 44],
    iconAnchor: [20, 44],
    popupAnchor: [0, -40],
  });
}

function FitBounds({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 12, { animate: false });
      return;
    }
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
  }, [map, positions]);
  return null;
}

/** Renders above the built-in zoom control (bottom-right). Must be a child of MapContainer. */
function MapLocatePortal() {
  const map = useMap();
  const container = map.getContainer();
  return createPortal(
    <div className="pointer-events-auto absolute bottom-[5.25rem] right-2.5 z-[1000] sm:bottom-[5.5rem] sm:right-3">
      <button
        type="button"
        title="Center map on your location"
        onClick={() => {
          if (!("geolocation" in navigator)) return;
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              map.flyTo([pos.coords.latitude, pos.coords.longitude], 12, { duration: 0.5 });
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 },
          );
        }}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200/90 bg-white text-neutral-700 shadow-md transition hover:bg-neutral-50"
      >
        <Crosshair className="h-4 w-4" aria-hidden />
      </button>
    </div>,
    container,
  );
}

export function WorkMap({ cases, onMarkerClickId }: Props) {
  const points = useMemo(
    () =>
      cases
        .filter((c) => c.latitude != null && c.longitude != null)
        .map((c) => ({
          id: c.id,
          position: [c.latitude as number, c.longitude as number] as LatLngTuple,
          case: c,
        })),
    [cases],
  );

  const indexed = useMemo(
    () => points.map((p, i) => ({ ...p, index: i + 1 })),
    [points],
  );

  if (points.length === 0) {
    return (
      <div className="flex h-full min-h-[min(50vh,420px)] w-full items-center justify-center bg-neutral-100 p-6 text-center text-sm text-neutral-500">
        Add latitude &amp; longitude to work cases in the admin to show pins.
      </div>
    );
  }

  const center: LatLngExpression = points[0].position;
  const positions: LatLngTuple[] = points.map((p) => p.position);

  return (
    <div className="relative h-full w-full min-h-0 min-h-[min(50vh,420px)]">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full !min-h-[min(50vh,420px)]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapLocatePortal />
        <FitBounds positions={positions} />
        {indexed.map(({ id, index, position, case: c }) => {
          const img = c.after_image_url || c.before_image_url;
          return (
            <Marker
              key={id}
              position={position}
              icon={pinIcon(index)}
              eventHandlers={{
                click: () => onMarkerClickId?.(id),
              }}
            >
              <Popup>
                <div className="flex w-56 max-w-[min(100%,224px)] flex-col gap-2">
                  {img && (
                    <img
                      src={img}
                      alt={c.title}
                      className="h-24 w-full rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{c.title}</p>
                    {c.location && (
                      <p className="text-xs text-neutral-500">{c.location}</p>
                    )}
                    {c.completed_at && (
                      <p className="text-xs text-neutral-500">
                        {new Date(c.completed_at).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <Link
                    to="/work"
                    className="inline-flex w-fit rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold !text-white no-underline hover:bg-blue-500 hover:!text-white focus:!text-white visited:!text-white"
                    onClick={() => onMarkerClickId?.(id)}
                  >
                    View details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
