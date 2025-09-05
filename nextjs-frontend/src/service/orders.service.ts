import { Order } from "@/types/order";

export const generateOrder = async (token: string, payload: Order) => {
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
        `Falha ao se inscrever em evento: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro na camada de serviço de ordens:", error);
    throw error;
  }
};
