import { Coordinates } from "@/types/coordinates";

export const getCoordinates = async (query: string): Promise<Coordinates[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/geocoding/search-by-query?query=${encodeURIComponent(query)}`,
    );

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
