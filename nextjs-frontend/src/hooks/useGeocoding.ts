import { getCoordinates } from "@/service/geocoding.service";
import { Coordinates } from "@/types/coordinates";
import { useState } from "react";

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
