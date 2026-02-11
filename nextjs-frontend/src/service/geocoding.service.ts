import { Address } from "@/types/address";
import { Coordinates } from "@/types/coordinates";

export const getCoordinates = async (
  location: Address,
): Promise<Coordinates[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/geocoding/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      },
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
