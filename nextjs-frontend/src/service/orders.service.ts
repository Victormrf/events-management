import { CreateOrderPayload } from "@/types/order";

export const generateOrder = async (
  token: string,
  payload: CreateOrderPayload,
) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Falha ao se inscrever em evento: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro na camada de serviço de ordens:", error);
    throw error;
  }
};

export const fetchOrder = async (token: string, eventId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/event/${eventId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Falha ao buscar inscrição do usuário: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro na camada de serviço de ordens:", error);
    throw error;
  }
};

export const fetchUserOrders = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Trata 404 como "sem inscrições" em vez de erro
    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(
        `Falha ao buscar inscrições do usuário: ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro na camada de serviço de ordens:", error);
    throw error;
  }
};

export const changeOrderStatus = async (
  token: string,
  eventId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELED",
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/event/${eventId}/change-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: status }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao atualizar evento.");
  }

  return response.json();
};
