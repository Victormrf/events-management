import { Event } from "@/types/event";

export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);

    if (!response.ok) {
      // Se a resposta não for OK, lança um erro com a mensagem do status
      throw new Error(`Falha ao buscar eventos: ${response.statusText}`);
    }

    const data: Event[] = await response.json();

    // Filtra os eventos para mostrar apenas os que ainda não ocorreram
    const upcomingEvents = data.filter(
      (event) => new Date(event.date) >= new Date()
    );

    return upcomingEvents;
  } catch (error) {
    // Relança o erro para ser capturado no hook que chamar esta função
    console.error("Erro na camada de serviço de eventos:", error);
    throw error;
  }
};
