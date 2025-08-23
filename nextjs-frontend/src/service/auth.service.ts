import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Falha ao registrar: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Erro na camada de serviço de autenticação: ", error);
    throw error;
  }
};

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`Falha ao fazer login: ${response.statusText}`);
  }

  return response.json();
}
