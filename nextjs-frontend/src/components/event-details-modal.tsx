"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, User, Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { EditFormData, EventDetailsModalProps } from "@/types/event";
import { useUpdateEvent } from "@/hooks/useEvents";
import toast from "react-hot-toast";

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: EventDetailsModalProps & { onSuccess: () => void }) {
  const {
    mutate: updateEvent,
    loading: updating,
    error: updateError,
  } = useUpdateEvent();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditFormData>();

  if (!event) return null;

  const formatPrice = (price: number) => {
    return price === 0 ? "Gratuito" : `R$ ${price.toFixed(2)}`;
  };

  const formatFullAddress = (address: typeof event.address) => {
    const parts = [
      address.street,
      address.neighborhood,
      address.city,
      address.state,
      address.zipCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Pre-fill form with current event data
    reset({
      title: event.title,
      description: event.description,
      date: format(event.date, "yyyy-MM-dd'T'HH:mm"),
      maxAttendees: event.maxAttendees,
      price: Number(event.price),
      address: {
        street: event.address.street,
        neighborhood: event.address.neighborhood || "",
        city: event.address.city,
        state: event.address.state,
        country: event.address.country,
        zipCode: event.address.zipCode || "",
      },
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit = async (data: EditFormData) => {
    const updateData = {
      title: data.title,
      description: data.description,
      date: new Date(data.date).toISOString(),
      maxAttendees: Number(data.maxAttendees),
      price: Number(data.price),
      address: data.address,
    };

    await toast.promise(updateEvent(event.id, updateData), {
      loading: "Salvando alterações...",
      success: "Evento atualizado com sucesso!",
      error: `Falha ao atualizar evento: ${updateError || "Erro desconhecido"}`,
    });

    onSuccess();
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? "Editar Evento" : "Detalhes do Evento"}</span>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold">{event.title}</h2>
                <Badge
                  variant={event.price === "0" ? "secondary" : "default"}
                  className="text-sm"
                >
                  {formatPrice(Number(event.price))}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(event.date, "dd/MM/yyyy 'às' HH:mm")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Máx. {event.maxAttendees} participantes</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{event.creator.name}</span>
                </div>

                <div className="text-muted-foreground">
                  Criado em {format(event.createdAt, "dd/MM/yyyy")}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localização
              </h3>
              <p className="text-muted-foreground">
                {formatFullAddress(event.address)}
              </p>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  {...register("title", { required: "Título é obrigatório" })}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição *</Label>
                <Textarea
                  id="edit-description"
                  {...register("description", {
                    required: "Descrição é obrigatória",
                  })}
                  rows={4}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Data e Hora *</Label>
                  <Input
                    id="edit-date"
                    type="datetime-local"
                    {...register("date", { required: "Data é obrigatória" })}
                    className={errors.date ? "border-destructive" : ""}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-maxAttendees">
                    Máx. Participantes *
                  </Label>
                  <Input
                    id="edit-maxAttendees"
                    type="number"
                    min="1"
                    {...register("maxAttendees", {
                      required: "Número máximo é obrigatório",
                      min: { value: 1, message: "Mínimo 1 participante" },
                    })}
                    className={errors.maxAttendees ? "border-destructive" : ""}
                  />
                  {errors.maxAttendees && (
                    <p className="text-sm text-destructive">
                      {errors.maxAttendees.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço (R$) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("price", {
                      required: "Preço é obrigatório",
                      min: { value: 0, message: "Preço não pode ser negativo" },
                    })}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-4">
              <h3 className="font-semibold">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-street">Rua *</Label>
                  <Input
                    id="edit-street"
                    {...register("address.street", {
                      required: "Rua é obrigatória",
                    })}
                    className={
                      errors.address?.street ? "border-destructive" : ""
                    }
                  />
                  {errors.address?.street && (
                    <p className="text-sm text-destructive">
                      {errors.address.street.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-neighborhood">Bairro</Label>
                  <Input
                    id="edit-neighborhood"
                    {...register("address.neighborhood")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-city">Cidade *</Label>
                  <Input
                    id="edit-city"
                    {...register("address.city", {
                      required: "Cidade é obrigatória",
                    })}
                    className={errors.address?.city ? "border-destructive" : ""}
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-destructive">
                      {errors.address.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-state">Estado *</Label>
                  <Input
                    id="edit-state"
                    {...register("address.state", {
                      required: "Estado é obrigatório",
                    })}
                    className={
                      errors.address?.state ? "border-destructive" : ""
                    }
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-destructive">
                      {errors.address.state.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-country">País *</Label>
                  <Input
                    id="edit-country"
                    {...register("address.country", {
                      required: "País é obrigatório",
                    })}
                    className={
                      errors.address?.country ? "border-destructive" : ""
                    }
                  />
                  {errors.address?.country && (
                    <p className="text-sm text-destructive">
                      {errors.address.country.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-zipCode">CEP</Label>
                  <Input id="edit-zipCode" {...register("address.zipCode")} />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={updating} className="flex-1">
                <Save className="h-4 w-4 mr-1" />
                {updating ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
