import { useAuth } from "@/context/auth-provider";
import { generateOrder } from "@/service/orders.service";
import { Order } from "@/types/order";
import { useCallback, useState } from "react";

export function useGenerateOrder() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateOrder = useCallback(
    async (payload: Order) => {
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
        await generateOrder(token, payload);
        setSuccess(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido ao se inscrever em evento.");
        }
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );
  return { handleCreateOrder, loading, error, success };
}
