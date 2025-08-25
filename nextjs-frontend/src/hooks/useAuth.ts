import { useAuth } from "@/context/auth-provider";
import { loginUser, registerUser } from "@/service/auth.service";
import { LoginPayload, RegisterPayload } from "@/types/auth";
import { useState } from "react";

export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(payload);
      // Após o login bem-sucedido, usa a função do contexto para salvar o token e o usuário
      login(response.access_token, response.user);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao fazer login.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

export const useRegister = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(payload);
      // Após o registro bem-sucedido, a API retorna o token, então usamos a função de login
      login(response.access_token, response.user);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido ao registrar.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
