import { useAuth } from "@/context/auth-provider";
import {
  changeOrderStatus,
  fetchOrder,
  fetchUserOrders,
  generateOrder,
} from "@/service/orders.service";
import { CreateOrderPayload, Order } from "@/types/order";
import { useCallback, useEffect, useState } from "react";

export function useGenerateOrder() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateOrder = useCallback(
    async (payload: CreateOrderPayload) => {
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
    [getToken],
  );
  return { handleCreateOrder, loading, error, success };
}

export function useGetOrder(eventId: string) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderByEventAndUser = async () => {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data: Order = await fetchOrder(token, eventId);
        setOrder(data);
      } catch (err) {
        // Assume que o erro é um objeto com a propriedade 'message'
        setError(
          "Não foi possível carregar essa inscrição. Por favor, tente novamente.",
        );
        console.error("Erro no hook useMyOrder:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderByEventAndUser();
  }, [getToken, eventId]);

  return { order, loading, error };
}

export function useMyOrders() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data: Order[] = await fetchUserOrders(token);
        setOrders(data);
      } catch (err) {
        setError(
          "Não foi possível carregar suas inscrições. Por favor, tente novamente.",
        );
        console.error("Erro no hook useMyOrders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken]);

  return { orders, loading, error };
}

export function useChangeOrderStatus() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (
    eventId: string,
    status: "PENDING" | "CONFIRMED" | "CANCELED",
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
      await changeOrderStatus(token, eventId, status);
      setSuccess(true);
      return;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao atualizar status da inscrição.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, success };
}
