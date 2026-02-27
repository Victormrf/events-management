"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  Ticket,
} from "lucide-react";
import { format } from "date-fns";
import { Address } from "@/types/address";
import { useMyOrders } from "@/hooks/useOrder";
import Link from "next/link";

export function MyRegistrationsList() {
  const { orders, loading, error } = useMyOrders();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const formatPrice = (price: string | number) => {
    const numPrice =
      typeof price === "string" ? Number.parseFloat(price) : price;
    return numPrice === 0 ? "Gratuito" : `R$ ${numPrice.toFixed(2)}`;
  };

  const formatAddress = (address: Address) => {
    return `${address.city}, ${address.state}`;
  };

  const formatFullAddress = (address: Address) => {
    const parts = [
      address.street,
      address.neighborhood,
      address.city,
      address.state,
      address.zipCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      CONFIRMED: { label: "Confirmado", variant: "confirmed" as const },
      PENDING: { label: "Pendente", variant: "pending" as const },
      CANCELLED: { label: "Cancelado", variant: "canceled" as const },
    };
    return (
      statusMap[status as keyof typeof statusMap] || {
        label: status,
        variant: "secondary" as const,
      }
    );
  };

  const toggleExpanded = (registrationId: string) => {
    setExpandedCard(expandedCard === registrationId ? null : registrationId);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando suas inscrições...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2 text-destructive">
          Erro ao carregar inscrições
        </h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Nenhuma insrição encontrada
        </h3>
        <p className="text-muted-foreground mb-4">
          Você ainda não se inscreveu em nenhum evento.
        </p>
        <Link href="/discovery">
          <Button>Explore eventos próximos a você</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((registration) => {
        const isExpanded = expandedCard === registration.id;
        const statusInfo = getStatusBadge(registration.status);

        return (
          <Card
            key={registration.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50"
            onClick={() => toggleExpanded(registration.id)}
          >
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {registration.event.title}
                </h3>
                <div className="flex flex-col gap-1 items-end">
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  <Badge
                    variant={
                      Number.parseFloat(registration.event.price) === 0
                        ? "secondary"
                        : "default"
                    }
                  >
                    {formatPrice(registration.event.price)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(registration.event.date), "dd/MM/yyyy")}
                  </span>
                  <span className="text-xs">
                    às {format(new Date(registration.event.date), "HH:mm")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{formatAddress(registration.event.address)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>
                    {registration.quantity} ingresso
                    {registration.quantity > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Always visible description preview */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {registration.event.description}
              </p>

              {/* Expanded content */}
              {isExpanded && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  {/* Full description */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Descrição Completa</h4>
                    <p className="text-sm text-muted-foreground">
                      {registration.event.description}
                    </p>
                  </div>

                  {/* Full address */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Localização</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatFullAddress(registration.event.address)}
                    </p>
                  </div>

                  {/* Registration details */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Detalhes da Inscrição
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Pago:</span>
                        <p className="text-muted-foreground">
                          R$ {registration.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Ingressos:</span>
                        <p className="text-muted-foreground">
                          {registration.quantity}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Inscrito em:</span>
                        <p className="text-muted-foreground">
                          {format(
                            new Date(registration.createdAt),
                            "dd/MM/yyyy",
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Capacidade:</span>
                        <p className="text-muted-foreground">
                          {registration.event.maxAttendees} pessoas
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Attendees */}
                  {registration.attendees.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Participantes</h4>
                      <div className="space-y-1">
                        {registration.attendees.map((attendee) => (
                          <div
                            key={attendee.id}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <User className="h-4 w-4" />
                            <span>{attendee.name}</span>
                            <span className="text-xs">({attendee.email})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-transparent"
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    {registration.status === "CONFIRMED" && (
                      <Button
                        variant="outline"
                        onClick={(e) => e.stopPropagation()}
                        className="text-destructive hover:text-destructive"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Expand/collapse indicator */}
              <div className="flex items-center justify-center pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{isExpanded ? "Mostrar menos" : "Mostrar mais"}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
