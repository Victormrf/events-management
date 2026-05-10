import { CreateEventPayload, Event } from "@/types/event";

const serializeEventData = (
  payload: Partial<CreateEventPayload> & { image?: File | null },
  formData: FormData,
) => {
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.date !== undefined) formData.append("date", payload.date);
  if (payload.maxAttendees !== undefined) formData.append("maxAttendees", String(payload.maxAttendees));
  if (payload.price !== undefined) formData.append("price", String(payload.price));
  if (payload.address !== undefined) formData.append("address", JSON.stringify(payload.address));
  if (payload.image) {
    formData.append("image", payload.image);
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);

    if (!response.ok) {
      throw new Error(`Falha ao buscar eventos: ${response.statusText}`);
    }

    const data: Event[] = await response.json();

    const upcomingEvents = data.filter(
      (event) => new Date(event.date) >= new Date(),
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
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao buscar eventos do usuário.");
  }

  return response.json();
};

export const createEvent = async (
  token: string,
  payload: CreateEventPayload & { image?: File | null },
): Promise<Event> => {
  const formData = new FormData();
  serializeEventData(payload, formData); // Usa a helper para montar o body

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao criar evento.");
  }

  return response.json();
};

export const updateEvent = async (
  token: string,
  eventId: string,
  payload: Partial<CreateEventPayload> & { image?: File | null },
): Promise<Event> => {
  const formData = new FormData();
  serializeEventData(payload, formData);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao atualizar evento.");
  }

  return response.json();
};

export const deleteEvent = async (
  token: string,
  eventId: string,
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao excluir evento.");
  }
};
