import { Coordinates } from "@/types/coordinates";
import { LocationInfo } from "@/types/location";

export const getCoordinates = async (query: string): Promise<Coordinates[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/geocoding/search-by-query?query=${encodeURIComponent(query)}`,
    );

    console.log("Resposta da API de Geocodificação:", response);

    if (!response.ok) {
      throw new Error(`Falha ao buscar coordenadas: ${response.statusText}`);
    }

    const data: Coordinates = await response.json();

    return [data];
  } catch (error) {
    console.error("Erro na camada de serviço de Geocodificação:", error);
    throw error;
  }
};

export const getReverseGeocoding = async (
  lat: number,
  lng: number,
): Promise<LocationInfo> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/geocoding/reverse?lat=${lat}&lng=${lng}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao converter coordenadas em endereço.");
  }

  return response.json();
};

export const seedNearbyEvents = async (location: LocationInfo) => {
  const { city, state, country } = location;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/geocoding/nearby?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}`,
    );

    if (!response.ok) {
      throw new Error("Falha ao gerar eventos para esta região.");
    }

    return response.json();
  } catch (error) {
    console.error("Erro na camada de serviço de Geocodificação:", error);
    throw error;
  }
};
