import { useAuth } from "@/context/auth-provider";
import {
  createEvent,
  deleteEvent,
  getEvents,
  getMyEvents,
  updateEvent,
} from "@/service/events.service";
import { CreateEventPayload, Event } from "@/types/event";
import { useCallback, useEffect, useState } from "react";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const upcomingEvents = await getEvents();
        setEvents(upcomingEvents);
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

    fetchEvents();
  }, []);

  return { events, loading, error };
}

export function useMyEvents() {
  const { getToken } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getToken();

    if (!token) {
      setError("Token de autenticação não disponível.");
      setLoading(false);
      return;
    }

    try {
      const fetchedEvents = await getMyEvents(token);
      setEvents(fetchedEvents);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao buscar eventos.");
      }
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  return { events, loading, error, refetch: fetchMyEvents };
}

export function useCreateEvent() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (payload: CreateEventPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = getToken();
    if (!token) {
      setError("Token de autenticação não disponível.");
      setLoading(false);
      return;
    }

    try {
      const newEvent = await createEvent(token, payload);
      setSuccess(true);
      return newEvent;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao criar evento.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, success };
}

export function useUpdateEvent() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (
    eventId: string,
    payload: Partial<CreateEventPayload>
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = getToken();
    if (!token) {
      setError("Token de autenticação não disponível.");
      setLoading(false);
      return;
    }

    try {
      const updatedEvent = await updateEvent(token, eventId, payload);
      setSuccess(true);
      return updatedEvent;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao atualizar evento.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, success };
}

export function useDeleteEvent() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (eventId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = getToken();
    if (!token) {
      setError("Token de autenticação não disponível.");
      setLoading(false);
      return;
    }

    try {
      await deleteEvent(token, eventId);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao deletar evento.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, success };
}
