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
import { Loader2, Info, Sparkles, Navigation, MapPinIcon } from "lucide-react";
import { EventCard } from "./event-card";
import "leaflet/dist/leaflet.css";
import { useCoordinates, useEventSeed } from "@/hooks/useGeocoding";

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
  const [mapIcon, setMapIcon] = useState<import("leaflet").Icon | null>(null);
  const [userIcon, setUserIcon] = useState<import("leaflet").Icon | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<import("leaflet").Map | null>(
    null,
  );
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<[number, number] | null>(
    null,
  );
  const [localEvents, setLocalEvents] = useState<AppEvent[]>(events);
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
      // Pin de evento (Esmeralda)
      const pinSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' fill='#10B981' stroke='#064E3B'/><circle cx='12' cy='10' r='3' fill='white'/></svg>`;

      // Pin de usuário (Azul/Pulsante)
      const userSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'><circle cx='12' cy='12' r='8' fill='#3B82F6' opacity='0.2'/><circle cx='12' cy='12' r='5' fill='#3B82F6'/><circle cx='12' cy='12' r='2.5' fill='white'/></svg>`;

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

  const referenceLocation = useMemo(
    () => searchLocation || userLocation,
    [searchLocation, userLocation],
  );

  // Filtrar eventos num raio de 10km
  const nearbyEvents = useMemo(() => {
    if (!referenceLocation) return [];
    return localEvents.filter((event) => {
      if (!event.address.lat || !event.address.lng) return false;
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
      const hasNearby = localEvents.some((e) => {
        if (!e.address.lat || !e.address.lng) return false;
        return calculateDistance(lat, lng, e.address.lat, e.address.lng) <= 10;
      });

      if (hasNearby || isSeeding) return;

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

  // Atualiza a posição do mapa quando a busca retorna coordenadas
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      setSearchLocation([coordinates[0].lat, coordinates[0].lng]);
    }
  }, [coordinates]);

  // Recentrar mapa quando a localização de busca muda
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

  if (!isClient || !userLocation || !mapIcon || !userIcon) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center rounded-2xl border bg-muted/20">
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
          <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/20 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm">
            <Sparkles className="h-12 w-12 text-emerald-400 animate-pulse" />
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
              <div className="bg-emerald-500 h-full w-1/2 animate-[shimmer_2s_infinite] origin-left"></div>
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
              ref={mapRef as any}
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
                  color: "#10b981",
                  fillColor: "#10b981",
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: "10, 15",
                }}
              />

              <Marker position={referenceLocation} icon={userIcon}>
                <Popup className="popup-dark">
                  <p className="text-xs font-bold p-1">Referência de Busca</p>
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
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${nearbyEvents.length > 0 ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}
          >
            <Info className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">
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
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-500" /> Explorar Área
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cidade ou endereço..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center"
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
                className="w-full text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1"
              >
                <MapPinIcon className="h-3 w-3" /> Usar minha posição atual
              </button>
            </div>
            {searchError && (
              <p className="text-[10px] text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                {searchError}
              </p>
            )}
          </form>

          {/* Card de Detalhes Selecionado */}
          <div className="flex-1 rounded-2xl border p-5 bg-card shadow-lg overflow-y-auto max-h-[400px]">
            {!selectedEvent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-10">
                <div className="p-4 rounded-full bg-slate-800">
                  <MapPinIcon className="h-8 w-8 text-slate-500" />
                </div>
                <p className="text-xs font-medium text-slate-400">
                  Clique em um marcador no mapa para ver detalhes.
                </p>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-2 duration-300">
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
