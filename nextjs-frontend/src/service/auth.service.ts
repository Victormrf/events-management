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

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
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
};

export const getProfile = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Falha ao obter perfil do usuário: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro na camada de serviço de autenticação: ", error);
    throw error;
  }
};
