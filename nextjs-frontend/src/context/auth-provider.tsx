"use client";

import type React from "react";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { AuthContextType } from "@/types/auth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { getProfile } from "@/service/auth.service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = useCallback(() => {
    return Cookies.get(AUTH_TOKEN_KEY);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(AUTH_TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Agora, a função login recebe o token E os dados do usuário
  const login = useCallback((token: string, userData: User) => {
    Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 });
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Função para recuperar o perfil do usuário
  const fetchUserProfile = useCallback(
    async (token: string) => {
      setIsLoading(true); // NOVO: Inicia o carregamento
      try {
        const userData = await getProfile(token);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao buscar o perfil do usuário:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false); // NOVO: Finaliza o carregamento se não houver token
    }
  }, [getToken, fetchUserProfile]);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      getToken,
      isLoading,
    }),
    [user, isAuthenticated, login, logout, getToken, isLoading]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};
