// components/create-event-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPin, Users, DollarSign } from "lucide-react";
import { EventFormData } from "@/types/event";
import toast from "react-hot-toast";
import { useCreateEvent } from "@/hooks/useEvents";
import { useRouter } from "next/navigation";

type FormDataWithImage = EventFormData & { image: FileList | null };

export function CreateEventForm() {
  const { mutate, loading, error } = useCreateEvent();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataWithImage>();

  const onSubmit = async (data: FormDataWithImage) => {
    const payload = {
      ...data,
      date: new Date(data.date).toISOString(),
    };

    const newEvent = await mutate(payload);

    if (newEvent) {
      toast.success("Evento criado com sucesso!");
      router.push("/my-events");
      reset();
    } else {
      toast.error(error || "Erro ao criar evento. Tente novamente.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Detalhes do Evento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Event Info */}
          <div className="space-y-4">
            {/* ... Título e Descrição ... */}
            <div className="space-y-2">
              <Label htmlFor="title">Título do Evento *</Label>
              <Input
                id="title"
                {...register("title", { required: "Título é obrigatório" })}
                placeholder="Nome do seu evento"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Descrição é obrigatória",
                })}
                placeholder="Descreva seu evento em detalhes"
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Campo de Imagem */}
            <div className="space-y-2">
              <Label htmlFor="image">Imagem do Evento (Opcional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                {...register("image")}
              />
            </div>
            {/* ... Data, Participantes e Preço ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Data e Hora * </span>
                </Label>
                <Input
                  id="date"
                  type="datetime-local"
                  {...register("date", { required: "Data é obrigatória" })}
                  className={errors.date ? "border-destructive" : ""}
                  placeholder="dd/mm/aaaa --:--"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="maxAttendees"
                  className="flex items-center gap-1"
                >
                  <Users className="h-4 w-4" />
                  Máx. Participantes
                </Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  {...register("maxAttendees", {
                    required: "Número máximo é obrigatório",
                    min: { value: 1, message: "Mínimo 1 participante" },
                    valueAsNumber: true, // Garante que o input seja tratado como number
                  })}
                  placeholder="100"
                  className={errors.maxAttendees ? "border-destructive" : ""}
                />
                {errors.maxAttendees && (
                  <p className="text-sm text-destructive">
                    {errors.maxAttendees.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Preço (R$)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", {
                    required: "Preço é obrigatório",
                    min: { value: 0, message: "Preço não pode ser negativo" },
                    valueAsNumber: true, // Garante que o input seja tratado como number
                  })}
                  placeholder="0.00"
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

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Endereço</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  {...register("address.street", {
                    required: "Rua é obrigatória",
                  })}
                  placeholder="Rua das Flores, 123"
                  className={errors.address?.street ? "border-destructive" : ""}
                />
                {errors.address?.street && (
                  <p className="text-sm text-destructive">
                    {errors.address.street.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  {...register("address.neighborhood")}
                  placeholder="Centro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  {...register("address.city", {
                    required: "Cidade é obrigatória",
                  })}
                  placeholder="São Paulo"
                  className={errors.address?.city ? "border-destructive" : ""}
                />
                {errors.address?.city && (
                  <p className="text-sm text-destructive">
                    {errors.address.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  {...register("address.state", {
                    required: "Estado é obrigatório",
                  })}
                  placeholder="SP"
                  className={errors.address?.state ? "border-destructive" : ""}
                />
                {errors.address?.state && (
                  <p className="text-sm text-destructive">
                    {errors.address.state.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  {...register("address.country", {
                    required: "País é obrigatório",
                  })}
                  placeholder="Brasil"
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
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  {...register("address.zipCode")}
                  placeholder="01234-567"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Criando..." : "Criar Evento"}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
