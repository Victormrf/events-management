import { useAuth } from "@/context/auth-provider";
import { createEvent, getEvents, getMyEvents } from "@/service/events.service";
import { CreateEventPayload, Event } from "@/types/event";
import { useEffect, useState } from "react";

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
  const { isAuthenticated, getToken } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const token = getToken();
      if (token) {
        try {
          const myEvents = await getMyEvents(token);
          setEvents(myEvents);
          setError(null);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError(String(err));
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("Token de autenticação não disponível.");
        setEvents([]);
      }
    };

    fetchMyEvents();
  }, [isAuthenticated, getToken]);

  return { events, loading, error };
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

    // try {
    console.log("Creating event with payload:", payload);

    const newEvent = await createEvent(token, payload);
    setSuccess(true);
    return newEvent;
    // } catch (err) {
    //   if (err instanceof Error) {
    //     setError(err.message);
    //   } else {
    //     setError("Erro desconhecido ao criar evento.");
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return { mutate, loading, error, success };
}
