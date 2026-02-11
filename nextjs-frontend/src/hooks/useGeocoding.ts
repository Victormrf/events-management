import { getCoordinates } from "@/service/geocoding.service";
import { Address } from "@/types/address";
import { Coordinates } from "@/types/coordinates";
import { useState } from "react";

export function useCoordinates() {
  const [coordinates, setCoordinates] = useState<Coordinates[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoordinates = async (location: Address) => {
    try {
      setLoading(true);
      const coordinates = await getCoordinates(location);
      setCoordinates(coordinates);
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
