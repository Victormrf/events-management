"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus, X, Loader2, CheckCircle, CreditCard } from "lucide-react";
import { Attendee } from "@/types/order";
import { Event } from "@/types/event";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGenerateOrder } from "@/hooks/useOrder";

interface EventRegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventRegistrationModal({
  event,
  isOpen,
  onOpenChange,
}: EventRegistrationModalProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([
    { name: "", email: "" },
  ]);
  const { handleCreateOrder, loading, error, success } = useGenerateOrder();
  const router = useRouter();

  const totalPrice = useMemo(() => {
    return (parseFloat(event.price) || 0) * attendees.length;
  }, [event.price, attendees.length]);

  const handleAttendeeChange = (
    index: number,
    field: keyof Attendee,
    value: string,
  ) => {
    const newAttendees = [...attendees];
    newAttendees[index] = {
      ...newAttendees[index],
      [field]: value,
    };
    setAttendees(newAttendees);
  };

  const addAttendee = () => {
    setAttendees([...attendees, { name: "", email: "" }]);
  };

  const removeAttendee = (index: number) => {
    const newAttendees = attendees.filter((_, i) => i !== index);
    setAttendees(newAttendees);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validAttendees = attendees.filter(
      (attendee) => attendee.name.trim() !== "",
    );
    if (validAttendees.length === 0) {
      toast.error("Por favor, adicione pelo menos um participante válido.", {
        position: "bottom-center",
      });
      return;
    }

    const orderData = {
      eventId: event.id,
      attendees: validAttendees,
    };

    await handleCreateOrder(orderData);
  };

  useEffect(() => {
    if (success) {
      if (totalPrice > 0) {
        toast.success("Você será redirecionado para a página de pagamento.", {
          position: "bottom-center",
        });
        router.push(`/payment/${event.id}`);
      } else {
        toast.success("Seu registro no evento gratuito foi confirmado.", {
          position: "bottom-center",
        });
        onOpenChange(false);
      }
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
      });
    }
  }, [success, error, onOpenChange, totalPrice, router, event]);

  return (
    <>
      <style>{`
        [data-registration-modal] {
          z-index: 1001 !important;
        }
        [data-registration-modal] ~ div {
          z-index: 1000 !important;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent data-registration-modal className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inscrição para {event.title}</DialogTitle>
            <DialogDescription>
              Preencha os dados dos participantes para se inscrever no evento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {attendees.map((attendee, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`name-${index}`}>Nome</Label>
                    <Input
                      id={`name-${index}`}
                      value={attendee.name}
                      onChange={(e) =>
                        handleAttendeeChange(index, "name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`email-${index}`}>Email (Opcional)</Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={attendee.email || ""}
                      onChange={(e) =>
                        handleAttendeeChange(index, "email", e.target.value)
                      }
                    />
                  </div>
                  {attendees.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttendee(index)}
                      className="self-end"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addAttendee}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Participante
            </Button>

            <div className="pt-4 border-t mt-4 flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : totalPrice > 0 ? (
                <CreditCard className="mr-2 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {loading
                ? "Processando..."
                : totalPrice > 0
                  ? "Ir para o Pagamento"
                  : "Confirmar Inscrição"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
