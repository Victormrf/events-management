import { CreateEventPayload, Event } from "@/types/event";

export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);

    if (!response.ok) {
      throw new Error(`Falha ao buscar eventos: ${response.statusText}`);
    }

    const data: Event[] = await response.json();

    const upcomingEvents = data.filter(
      (event) => new Date(event.date) >= new Date()
    );

    return upcomingEvents;
  } catch (error) {
    console.error("Erro na camada de serviço de eventos:", error);
    throw error;
  }
};

export const getMyEvents = async (token: string): Promise<Event[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/my-events`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao buscar eventos do usuário.");
  }

  return response.json();
};

export const createEvent = async (
  token: string,
  payload: CreateEventPayload
): Promise<Event> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao criar evento.");
  }

  return response.json();
};
