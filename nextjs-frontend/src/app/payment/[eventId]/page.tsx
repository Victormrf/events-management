"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useChangeOrderStatus, useGetOrder } from "@/hooks/useOrder";
import { OrderSummary } from "@/types/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const { order, loading, error } = useGetOrder(eventId);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard">("visa");
  const { mutate: updateOrderStatus, error: updateError } =
    useChangeOrderStatus();
  const router = useRouter();

  const CARD_PATTERNS = {
    visa: "^4[0-9]{12}(?:[0-9]{3})?$",
    mastercard: "^(5[1-5][0-9]{14})$",
  };

  useEffect(() => {
    if (typeof window !== "undefined" && order) {
      setOrderSummary({
        individualPrice: parseFloat(order.event.price),
        quantity: order.attendees.length,
        totalPrice: order.totalAmount,
      });
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsProcessing(true);

    setTimeout(async () => {
      await toast.promise(updateOrderStatus(eventId, "CONFIRMED"), {
        loading: "Salvando alterações...",
        success: "Inscrição realizada com sucesso!",
        error: `Falha ao confirmar inscrição: ${
          updateError || "Erro desconhecido"
        }`,
      });
      router.push(`/my-registrations`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" />
        <p className="text-muted-foreground">
          Recuperando dados da inscrição...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2 text-destructive">
          Erro ao carregar a inscrição
        </h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 flex min-h-[40vh] items-center justify-center">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Payment
        </h2>

        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
          {/* --- Formulário de Pagamento --- */}
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8"
          >
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="full_name">
                  Full name (as displayed on card)*
                </Label>
                <input
                  type="text"
                  id="full_name"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Bonnie Green"
                  required
                />
              </div>

              {/* --- SELEÇÃO DE BANDEIRA --- */}
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="card-brand">Card Brand*</Label>
                <Select
                  onValueChange={(value: "visa" | "mastercard") =>
                    setCardBrand(value)
                  }
                  defaultValue={cardBrand}
                >
                  <SelectTrigger id="card-brand" className="mt-2">
                    <SelectValue placeholder="Select card brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="card-number-input">Card number*</Label>
                <input
                  type="text"
                  id="card-number-input"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  pattern={CARD_PATTERNS[cardBrand]}
                  title={`Please enter a valid ${cardBrand} card number.`}
                  required
                />
              </div>

              <div>
                <Label htmlFor="card-expiration-input">Card expiration*</Label>
                <input
                  id="card-expiration-input"
                  type="text"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="MM/YY"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cvv-input">CVV*</Label>
                <input
                  type="number"
                  id="cvv-input"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="•••"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isProcessing} className="w-full">
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isProcessing ? "Processing..." : "Pay now"}
            </Button>
          </form>

          {/* --- Resumo do Pedido (Sidebar) --- */}
          {orderSummary.totalPrice && (
            <div className="mt-6 grow sm:mt-8 lg:mt-0">
              <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      Individual price
                    </dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {`R$ ${orderSummary.individualPrice?.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}`}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Quantity
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {orderSummary.quantity}
                    </dd>
                  </dl>
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total price
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    {`R$ ${orderSummary.totalPrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`}
                  </dd>
                </dl>
              </div>

              {/* Logos de Pagamento */}
              <div className="mt-6 flex items-center justify-center gap-8">
                <Image
                  className="h-8 w-auto"
                  height={32}
                  width={64}
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg"
                  alt="Visa"
                />
                <Image
                  className="h-8 w-auto"
                  height={32}
                  width={64}
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg"
                  alt="Mastercard"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
