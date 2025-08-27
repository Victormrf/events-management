"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { EventDetailsModal } from "@/components/event-details-modal";
import { useDeleteEvent, useMyEvents } from "@/hooks/useEvents";
import toast from "react-hot-toast";

export function MyEventsList() {
  const { events, loading, error, refetch } = useMyEvents();
  const {
    mutate: deleteEvent,
    loading: deleting,
    error: deleteError,
  } = useDeleteEvent();
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: string) => {
    return price === "0" ? "Gratuito" : `R$ ${Number(price).toFixed(2)}`;
  };

  const formatAddress = (address: (typeof events)[0]["address"]) => {
    return `${address.city}, ${address.state}`;
  };

  const handleViewEvent = (event: (typeof events)[0]) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      await toast.promise(deleteEvent(eventId), {
        loading: "Excluindo evento...",
        success: "Evento excluído com sucesso!",
        error: `Falha ao excluir evento: ${deleteError || "Erro desconhecido"}`,
      });
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando seus eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2 text-destructive">
          Erro ao carregar eventos
        </h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Você ainda não criou nenhum evento.
        </p>
        <Button>Criar Primeiro Evento</Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {event.title}
                </h3>
                <Badge variant={event.price === "0" ? "secondary" : "default"}>
                  {formatPrice(event.price)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(event.date, "dd/MM/yyyy")}</span>
                  <span className="text-xs">
                    às {format(event.date, "HH:mm")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{formatAddress(event.address)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Máx. {event.maxAttendees} participantes</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {event.description}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleViewEvent(event)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-destructive hover:text-destructive"
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={refetch}
      />
    </>
  );
}
