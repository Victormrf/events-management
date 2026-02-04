"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Event } from "@/types/event";
import { Loader2, MapPin, Navigation, Info, ExternalLink } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface DiscoveryMapProps {
  events: Event[];
}

export default function DiscoveryMap({ events }: DiscoveryMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [isClient, setIsClient] = useState(false);
  const [mapIcon, setMapIcon] = useState<import("leaflet").Icon | null>(null);

  useEffect(() => {
    setIsClient(true);

    import("leaflet").then((L) => {
      const cssPrimary =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--color-primary",
        ) ||
        getComputedStyle(document.documentElement).getPropertyValue(
          "--primary",
        ) ||
        "#10B981";

      const pinSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='36' height='48' viewBox='0 0 24 24' aria-hidden='true'>
          <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' fill='${cssPrimary.trim()}'/>
          <circle cx='12' cy='9' r='2.5' fill='white'/>
        </svg>
      `;

      const svgUrl = `data:image/svg+xml;utf8,${encodeURIComponent(pinSvg)}`;

      const DefaultIcon = L.icon({
        iconUrl: svgUrl,
        iconSize: [36, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -40],
        className: "leaflet-marker-icon-custom",
      });

      setMapIcon(DefaultIcon);
    });

    // Obter localização do utilizador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {
          console.warn(
            "Localização negada pelo utilizador. Usando posição padrão.",
          );
          setUserLocation([-23.5505, -46.6333]); // Exemplo: São Paulo
        },
      );
    }
  }, []);

  // Filtrar eventos num raio de 10km
  const nearbyEvents = useMemo(() => {
    if (!userLocation) return [];
    return events.filter((event) => {
      if (!event.address.lat || !event.address.lng) return false;
      const dist = calculateDistance(
        userLocation[0],
        userLocation[1],
        event.address.lat,
        event.address.lng,
      );
      return dist <= 10;
    });
  }, [events, userLocation]);

  if (!isClient || !userLocation || !mapIcon) {
    return (
      <div className="flex h-[50vh] md:h-[70vh] lg:h-[80vh] w-full items-center justify-center rounded-lg border bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">
          A carregar mapa...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Eventos Próximos</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Navigation className="h-3 w-3" />
          <span>Raio de 10km da sua posição</span>
        </div>
      </div>

      <div className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden rounded-xl border shadow-inner">
        <MapContainer
          center={userLocation}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Marcador da posição do utilizador */}
          <Circle
            center={userLocation}
            radius={10000}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.05,
              weight: 1,
              dashArray: "8, 12",
            }}
          />

          {/* Marcadores dos eventos próximos */}
          {nearbyEvents.map((event) => (
            <Marker
              key={event.id}
              position={[event.address.lat!, event.address.lng!]}
              icon={mapIcon}
            >
              <Popup className="popup-dark">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-slate-100">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        event.price === "0"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {event.price === "0"
                        ? "Grátis"
                        : `R$ ${Number(event.price).toFixed(2)}`}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 text-sm leading-tight mb-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 active:scale-[0.98]">
                    Ver Detalhes
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* overlay de gradiente para aproximar o mapa ao fundo da aplicação; pointer-events: none para preservar interatividade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 map-gradient-overlay"
        />
      </div>

      {nearbyEvents.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200">
          <Info className="h-4 w-4" />
          Nenhum evento encontrado num raio de 10km.
        </div>
      )}
    </div>
  );
}
