"use client";

import { useEffect, useState, useMemo, FormEvent, useRef } from "react";
import dynamic from "next/dynamic";
import { Event } from "@/types/event";
import { Loader2, Info } from "lucide-react";
import { EventCard } from "./event-card";
import "leaflet/dist/leaflet.css";
import { useCoordinates } from "@/hooks/useGeocoding";

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
  const [userIcon, setUserIcon] = useState<import("leaflet").Icon | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<import("leaflet").Map | null>(
    null,
  );
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<[number, number] | null>(
    null,
  );
  const { fetchCoordinates, coordinates, loading, error } = useCoordinates();

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

      const userSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' aria-hidden='true'>
          <circle cx='12' cy='12' r='8' fill='#51ee9c' opacity='0.2'/>
          <circle cx='12' cy='12' r='5' fill='#51ee9c'/>
          <circle cx='12' cy='12' r='2.5' fill='white'/>
        </svg>
      `;

      const userSvgUrl = `data:image/svg+xml;utf8,${encodeURIComponent(userSvg)}`;

      const UserIcon = L.icon({
        iconUrl: userSvgUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -25],
        className: "leaflet-marker-icon-user",
      });

      setUserIcon(UserIcon);
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
    const referenceLocation = searchLocation || userLocation;
    if (!referenceLocation) return [];
    return events.filter((event) => {
      if (!event.address.lat || !event.address.lng) return false;
      const dist = calculateDistance(
        referenceLocation[0],
        referenceLocation[1],
        event.address.lat,
        event.address.lng,
      );
      return dist <= 10;
    });
  }, [events, userLocation, searchLocation]);

  // Recentrar mapa quando a localização de busca muda
  useEffect(() => {
    if (searchLocation && mapRef.current) {
      mapRef.current.setView(searchLocation, 13);
    }
  }, [searchLocation]);

  // Atualizar localização de busca quando as coordenadas forem carregadas
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const lat = coordinates[0].lat;
      const lng = coordinates[0].lng;
      setSearchLocation([lat, lng]);
    }
  }, [coordinates]);

  if (!isClient || !userLocation || !mapIcon || !userIcon) {
    return (
      <div className="flex h-[50vh] md:h-[70vh] lg:h-[80vh] w-full items-center justify-center rounded-lg border bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">
          A carregar mapa...
        </span>
      </div>
    );
  }

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery) return;

    fetchCoordinates(searchQuery);
  };

  const handleMyLocation = () => {
    if (mapInstance && userLocation) {
      setSearchLocation(null);
      mapInstance.setView(userLocation, 13);
    }
  };

  return (
    <div>
      <style>{`
        .leaflet-control { z-index: 400 !important; }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Element 2: Map (left, spans 2 cols on md) */}
        <div className="md:col-span-2">
          <div className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden rounded-xl border shadow-inner">
            <MapContainer
              center={searchLocation || userLocation}
              zoom={13}
              scrollWheelZoom={true}
              ref={mapRef as any}
              whenReady={() => {
                if (mapRef.current) setMapInstance(mapRef.current);
              }}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              <Circle
                center={searchLocation || userLocation}
                radius={10000}
                pathOptions={{
                  color: "#10b981",
                  fillColor: "#10b981",
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: "8, 12",
                }}
              />

              <Marker position={searchLocation || userLocation} icon={userIcon}>
                <Popup className="popup-dark">
                  <div className="p-3 flex flex-col gap-2">
                    <h3 className="font-bold text-slate-100 text-sm">
                      {searchLocation ? "Localização de Busca" : "Sua Posição"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Latitude: {(searchLocation || userLocation)[0].toFixed(4)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Longitude:{" "}
                      {(searchLocation || userLocation)[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {nearbyEvents.map((event) => (
                <Marker
                  key={event.id}
                  position={[event.address.lat!, event.address.lng!]}
                  icon={mapIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedEvent(event);
                      setExpandedEvent(event.id);
                    },
                  }}
                />
              ))}
            </MapContainer>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 map-gradient-overlay"
            />
          </div>

          {nearbyEvents.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200 mt-3">
              <Info className="h-4 w-4" />
              Nenhum evento encontrado num raio de 10km.
            </div>
          )}
        </div>

        {/* Right column: search form (3) and event panel (4) */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Element 3: simple location search form */}
          <form
            onSubmit={handleSearch}
            className="rounded-xl border p-4 bg-card shadow-sm"
          >
            <label className="text-lg font-medium mb-2 block">
              Insira uma outra localização
            </label>
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Endereço, cidade ou coordenadas"
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Buscar localização"
              />
              <button
                className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold px-5 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Buscar"
                )}
              </button>
            </div>
            <div className="mt-2 text-sm text-muted-foreground flex gap-2">
              <button
                type="button"
                onClick={handleMyLocation}
                className="text-primary underline"
              >
                Usar Minha localização
              </button>
            </div>
            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm text-red-700 border border-red-200">
                <Info className="h-4 w-4" />
                {error}
              </div>
            )}
          </form>

          {/* Element 4: event panel */}
          <div className="rounded-xl border p-4 bg-card shadow-sm min-h-[200px]">
            {!selectedEvent ? (
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">Detalhes do evento</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Selecione um evento no mapa para ver mais detalhes aqui.
                </p>
              </div>
            ) : (
              <EventCard
                event={selectedEvent}
                isExpanded={expandedEvent === selectedEvent.id}
                onExpand={() => setExpandedEvent(selectedEvent.id)}
                onCollapse={() => setExpandedEvent(null)}
                isDimmed={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
