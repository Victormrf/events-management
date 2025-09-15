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

const mockRegistrations = [
  {
    id: "3b7d5b35-931c-4dc7-9a13-d88435dee763",
    totalAmount: 0,
    quantity: 1,
    status: "CONFIRMED",
    createdAt: "2025-09-05T05:24:43.141Z",
    updatedAt: "2025-09-05T05:24:43.141Z",
    userId: "84bd8963-9fea-4e41-a101-86725cd52a99",
    eventId: "1e7684d6-8c1a-4de5-b9c1-cd0015d1ad6b",
    event: {
      id: "1e7684d6-8c1a-4de5-b9c1-cd0015d1ad6b",
      title: "Test event september",
      description: "This is a new test event",
      date: "2025-09-30T10:00:00.000Z",
      maxAttendees: 20,
      price: "0",
      createdAt: "2025-09-05T03:56:18.682Z",
      updatedAt: "2025-09-05T03:56:18.682Z",
      creatorId: "84bd8963-9fea-4e41-a101-86725cd52a99",
      addressId: "065969ce-fd2c-470a-9976-ebc2ad4e1a68",
      address: {
        street: "Rua das Flores, 123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
        zipCode: "01234-567",
      },
    },
    attendees: [
      {
        id: "adc58059-61f5-4419-804a-6e30e8ec3c7f",
        name: "victor",
        email: "vmrf2000@hotmail.com",
        createdAt: "2025-09-05T05:24:43.170Z",
        updatedAt: "2025-09-05T05:24:43.170Z",
        orderId: "3b7d5b35-931c-4dc7-9a13-d88435dee763",
      },
    ],
  },
  {
    id: "4c8e6b46-042d-5ed8-0b24-e99546eff874",
    totalAmount: 150.0,
    quantity: 2,
    status: "CONFIRMED",
    createdAt: "2025-08-15T10:30:00.000Z",
    updatedAt: "2025-08-15T10:30:00.000Z",
    userId: "84bd8963-9fea-4e41-a101-86725cd52a99",
    eventId: "2f8795e7-9d2b-5ef6-c0d2-de1126e2be7c",
    event: {
      id: "2f8795e7-9d2b-5ef6-c0d2-de1126e2be7c",
      title: "Workshop de React Avançado",
      description:
        "Aprenda técnicas avançadas de React com hooks customizados, performance e patterns modernos",
      date: "2025-10-15T14:00:00.000Z",
      maxAttendees: 30,
      price: "75.00",
      createdAt: "2025-08-01T09:00:00.000Z",
      updatedAt: "2025-08-01T09:00:00.000Z",
      creatorId: "95ce9074-0afb-5f52-b212-97836de63f00",
      addressId: "176a80df-ge3d-581b-a087-fcd1be3e2c79",
      address: {
        street: "Av. Paulista, 1000",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
        zipCode: "01310-100",
      },
    },
    attendees: [
      {
        id: "adc58059-61f5-4419-804a-6e30e8ec3c7f",
        name: "victor",
        email: "vmrf2000@hotmail.com",
        createdAt: "2025-08-15T10:30:00.000Z",
        updatedAt: "2025-08-15T10:30:00.000Z",
        orderId: "4c8e6b46-042d-5ed8-0b24-e99546eff874",
      },
    ],
  },
];

export function MyRegistrationsList() {
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
      CONFIRMED: { label: "Confirmado", variant: "default" as const },
      PENDING: { label: "Pendente", variant: "secondary" as const },
      CANCELLED: { label: "Cancelado", variant: "destructive" as const },
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

  if (mockRegistrations.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Nenhuma inscrição encontrada
        </h3>
        <p className="text-muted-foreground mb-4">
          Você ainda não se inscreveu em nenhum evento.
        </p>
        <Button>Explorar Eventos</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockRegistrations.map((registration) => {
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
                            "dd/MM/yyyy"
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
