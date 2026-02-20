import {
  getCoordinates,
  getReverseGeocoding,
  seedNearbyEvents,
} from "@/service/geocoding.service";
import { Coordinates } from "@/types/coordinates";
import { useCallback, useState } from "react";

export function useCoordinates() {
  const [coordinates, setCoordinates] = useState<Coordinates[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoordinates = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCoordinates(query);
      setCoordinates(result);
      console.log("coordenadas retornadas:", result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return { fetchCoordinates, coordinates, loading, error };
}

export const useEventSeed = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerSeed = useCallback(
    async (lat: number, lng: number): Promise<Event[] | null> => {
      setIsSeeding(true);
      setError(null);

      try {
        const location = await getReverseGeocoding(lat, lng);

        if (!location || !location.city) {
          throw new Error(
            "Não foi possível determinar a cidade para estas coordenadas.",
          );
        }

        console.log(
          `[SEED] Iniciando geração de eventos para ${location.city}...`,
        );
        const newEvents = await seedNearbyEvents(location);

        return newEvents;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erro ao povoar região com eventos.";
        setError(msg);
        console.error("[Hook useEventSeed] Erro:", msg);
        return null;
      } finally {
        setIsSeeding(false);
      }
    },
    [],
  );

  return { triggerSeed, isSeeding, error };
};
