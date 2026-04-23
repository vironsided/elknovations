import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import L, { type LatLngBoundsExpression, type LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { WorkCase } from "../../hooks/useSiteData";

type Props = { cases: WorkCase[] };

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ positions }: { positions: LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 12, { animate: false });
      return;
    }
    const bounds = L.latLngBounds(positions as LatLngBoundsExpression);
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
  }, [map, positions]);
  return null;
}

export function WorkMap({ cases }: Props) {
  const points = useMemo(
    () =>
      cases
        .filter((c) => c.latitude != null && c.longitude != null)
        .map((c) => ({
          id: c.id,
          position: [c.latitude as number, c.longitude as number] as LatLngExpression,
          case: c,
        })),
    [cases],
  );

  if (points.length === 0) {
    return (
      <div className="flex h-full min-h-[360px] items-center justify-center bg-neutral-100 p-6 text-center text-sm text-neutral-500">
        Add latitude &amp; longitude to projects in the admin panel to see them on the map.
      </div>
    );
  }

  const center: LatLngExpression = points[0].position;
  const positions = points.map((p) => p.position);

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={false}
      className="h-full min-h-[360px] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds positions={positions} />
      {points.map(({ id, position, case: c }) => {
        const img = c.after_image_url || c.before_image_url;
        return (
          <Marker key={id} position={position} icon={defaultIcon}>
            <Popup>
              <div className="flex w-56 flex-col gap-2">
                {img && (
                  <img
                    src={img}
                    alt={c.title}
                    className="h-28 w-full rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{c.title}</p>
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
                  className="inline-flex w-fit rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800"
                >
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
