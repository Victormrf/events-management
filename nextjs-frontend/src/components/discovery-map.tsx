/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  useEffect,
  useState,
  useMemo,
  FormEvent,
  useRef,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import { Event as AppEvent } from "@/types/event";
import { Loader2, Info, Sparkles, Navigation, MapPin } from "lucide-react";
import { EventCard } from "./event-card";
import "leaflet/dist/leaflet.css";
import { useCoordinates, useEventSeed } from "@/hooks/useGeocoding";

// Carregamento dinâmico com tipagem flexível para evitar erros de Overload
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
) as any;

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
) as any;

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
) as any;

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
}) as any;

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
) as any;

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
  events: AppEvent[];
  onEventsUpdated?: (newEvents: AppEvent[]) => void;
}

export default function DiscoveryMap({
  events,
  onEventsUpdated,
}: DiscoveryMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [isClient, setIsClient] = useState(false);
  const [mapIcon, setMapIcon] = useState<any>(null);
  const [userIcon, setUserIcon] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<[number, number] | null>(
    null,
  );
  const [localEvents, setLocalEvents] = useState<AppEvent[]>(events);

  const lastSeededCoords = useRef<string | null>(null);

  const {
    fetchCoordinates,
    coordinates,
    loading: searchLoading,
    error: searchError,
  } = useCoordinates();

  const { triggerSeed, isSeeding } = useEventSeed();

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  useEffect(() => {
    setIsClient(true);

    import("leaflet").then((L) => {
      const pinSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='48' viewBox='0 0 24 24' fill='none' stroke='#064E3B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' fill='#5dd9c1' stroke='#064E3B'/><circle cx='12' cy='10' r='3' fill='white'/></svg>`;
      const userSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'><circle cx='12' cy='12' r='8' fill='#ff206e' opacity='0.2'/><circle cx='12' cy='12' r='5' fill='#ff206e'/><circle cx='12' cy='12' r='2.5' fill='white'/></svg>`;

      setMapIcon(
        L.icon({
          iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(pinSvg)}`,
          iconSize: [36, 48],
          iconAnchor: [18, 48],
          popupAnchor: [0, -40],
        }),
      );

      setUserIcon(
        L.icon({
          iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(userSvg)}`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        }),
      );
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {
          console.warn("Localização negada. Usando posição padrão.");
          setUserLocation([-21.7642, -43.3503]);
        },
      );
    }
  }, []);

  const referenceLocation = useMemo(
    () => searchLocation || userLocation,
    [searchLocation, userLocation],
  );

  const nearbyEvents = useMemo(() => {
    if (!referenceLocation) return [];
    return localEvents.filter((event) => {
      if (!event?.address?.lat || !event?.address?.lng) return false;
      const dist = calculateDistance(
        referenceLocation[0],
        referenceLocation[1],
        event.address.lat,
        event.address.lng,
      );
      return dist <= 10;
    });
  }, [localEvents, referenceLocation]);

  const handleCheckAndSeed = useCallback(
    async (lat: number, lng: number) => {
      const coordKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      if (lastSeededCoords.current === coordKey) return;

      const hasNearby = localEvents.some(
        (e) =>
          e.address.lat &&
          e.address.lng &&
          calculateDistance(lat, lng, e.address.lat, e.address.lng) <= 10,
      );

      if (hasNearby || isSeeding) {
        lastSeededCoords.current = coordKey; // Marca como processado mesmo se já tinha eventos
        return;
      }

      console.log("[DiscoveryMap] Iniciando seed para:", coordKey);
      lastSeededCoords.current = coordKey;

      const newEvents = await triggerSeed(lat, lng);

      if (newEvents && newEvents.length > 0) {
        const typedEvents = newEvents as unknown as AppEvent[];
        setLocalEvents((prev) => [...prev, ...typedEvents]);
        if (onEventsUpdated) onEventsUpdated(typedEvents);
      }
    },
    [localEvents, isSeeding, triggerSeed, onEventsUpdated],
  );

  useEffect(() => {
    if (referenceLocation) {
      handleCheckAndSeed(referenceLocation[0], referenceLocation[1]);
    }
  }, [referenceLocation, handleCheckAndSeed]);

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      setSearchLocation([coordinates[0].lat, coordinates[0].lng]);
    }
  }, [coordinates]);

  useEffect(() => {
    if (searchLocation && mapRef.current) {
      mapRef.current.setView(searchLocation, 13);
    }
  }, [searchLocation]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery) fetchCoordinates(searchQuery);
  };

  const resetToMyLocation = () => {
    setSearchLocation(null);
    if (userLocation) mapInstance?.setView(userLocation, 13);
  };

  if (
    !isClient ||
    !userLocation ||
    !mapIcon ||
    !userIcon ||
    !referenceLocation
  ) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center rounded-2xl border bg-slate-900/10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          Iniciando sistemas de mapeamento...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <style>{`.leaflet-control { z-index: 10 !important; }`}</style>

      {/* Overlay de carregamento da IA */}
      {isSeeding && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm rounded-2xl animate-in fade-in duration-300">
          <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/20 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm mx-4">
            <Sparkles className="h-12 w-12 text-foreground animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                Gerando Experiências
              </h3>
              <p className="text-slate-400 text-xs">
                Não encontramos eventos por aqui. Nossa IA está povoando a
                região com eventos fictícios realistas...
              </p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-foreground h-full w-1/2 animate-[shimmer_2s_infinite] origin-left"></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel do Mapa */}
        <div className="md:col-span-2 space-y-4">
          <div className="relative h-[55vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-xl">
            <MapContainer
              center={referenceLocation}
              zoom={13}
              ref={mapRef}
              whenReady={() => {
                if (mapRef.current) setMapInstance(mapRef.current);
              }}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

              <Circle
                center={referenceLocation}
                radius={10000}
                pathOptions={{
                  color: "#5dd9c1",
                  fillColor: "#5dd9c1",
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: "10, 15",
                }}
              />

              <Marker position={referenceLocation} icon={userIcon}>
                <Popup className="popup-dark">
                  <p className="text-xs font-bold p-1 text-white">
                    Referência de Busca
                  </p>
                </Popup>
              </Marker>

              {nearbyEvents.map((event: AppEvent) => (
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
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${nearbyEvents.length > 0 ? "bg-emerald-500/5 border-emerald-500/20 text-foreground" : "bg-slate-800 border-slate-700 text-slate-400"}`}
          >
            <Info className="h-5 w-5 shrink-0" />
            <span className="text-sm text-foreground font-medium">
              {nearbyEvents.length > 0
                ? `Encontramos ${nearbyEvents.length} eventos no raio de 10km.`
                : "Nenhum evento encontrado. Tente buscar uma nova área."}
            </span>
          </div>
        </div>

        {/* Painel Lateral */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Formulário de Localização */}
          <form
            onSubmit={handleSearch}
            className="rounded-2xl border p-5 bg-card shadow-lg space-y-4"
          >
            <h3 className="text-lg text-foreground font-bold flex items-center gap-2">
              <Navigation className="h-5 w-5 text-foreground" /> Explore outras
              localizações
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cidade ou endereço..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground outline-none transition-all text-white"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="bg-primary/80 hover:bg-primary disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center min-w-[80px]"
                >
                  {searchLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Buscar"
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={resetToMyLocation}
                className="w-full text-md text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <MapPin className="h-3 w-3" /> Usar minha posição atual
              </button>
            </div>
            {searchError && (
              <p className="text-[10px] text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                {searchError}
              </p>
            )}
          </form>

          {/* Card de Detalhes Selecionado*/}
          <div className="flex-1 rounded-2xl border p-5 bg-card shadow-lg overflow-y-auto min-h-[300px] max-h-[600px] lg:max-h-[65vh]">
            {!selectedEvent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-12">
                <div className="p-5 rounded-full bg-slate-800">
                  <MapPin className="h-10 w-10 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-300">
                    Nenhum evento selecionado
                  </p>
                  <p className="text-xs text-slate-500 max-w-[180px] mx-auto">
                    Clique em um marcador no mapa para ver os detalhes completos
                    aqui.
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <EventCard
                  event={selectedEvent}
                  isExpanded={expandedEvent === selectedEvent.id}
                  onExpand={() => setExpandedEvent(selectedEvent.id)}
                  onCollapse={() => setExpandedEvent(null)}
                  isDimmed={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
