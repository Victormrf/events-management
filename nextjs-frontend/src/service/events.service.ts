import { CreateEventPayload, Event } from "@/types/event";

const serializeEventData = (
  payload: CreateEventPayload & { image?: File | null },
  formData: FormData
) => {
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("date", payload.date);
  formData.append("maxAttendees", String(payload.maxAttendees));
  formData.append("price", String(payload.price));
  formData.append("address", JSON.stringify(payload.address));
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
  payload: CreateEventPayload & { image?: File | null }
): Promise<Event> => {
  const formData = new FormData();
  serializeEventData(payload, formData); // Usa a helper para montar o body

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: "POST",
    headers: {
      // Importante: O navegador define o Content-Type: multipart/form-data
      // Não inclua o header manualmente!
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Envia o objeto FormData
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Lançar a mensagem de erro do backend para o toast
    throw new Error(errorData.message || "Falha ao criar evento.");
  }

  return response.json();
};

export const updateEvent = async (
  token: string,
  eventId: string,
  payload: Partial<CreateEventPayload> & { image?: File | null }
): Promise<Event> => {
  const formData = new FormData();
  serializeEventData(
    payload as CreateEventPayload & { image?: File | null },
    formData
  );

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao atualizar evento.");
  }

  return response.json();
};

export const deleteEvent = async (
  token: string,
  eventId: string
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao excluir evento.");
  }
};
