"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Event } from "@/types/event";
import { Loader2, MapPin, Navigation, Info } from "lucide-react";
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
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
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
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcador da posição do utilizador */}
          <Circle
            center={userLocation}
            radius={10000}
            pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
          />

          {/* Marcadores dos eventos próximos */}
          {nearbyEvents.map((event) => (
            <Marker
              key={event.id}
              position={[event.address.lat!, event.address.lng!]}
              icon={mapIcon}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-primary">{event.title}</h3>
                  <p className="text-xs line-clamp-2 mt-1">
                    {event.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      {event.price === "0" ? "Grátis" : `R$ ${event.price}`}
                    </span>
                    <button className="text-[10px] underline text-blue-600">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
