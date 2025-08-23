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
import { Navigate } from "react-router-dom";
import { AuthContextType } from "@/types/auth";
import { User } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getToken = useCallback(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Agora, a função login recebe o token E os dados do usuário
  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Função para decodificar o token para RESTAURAR a sessão
  const decodeAndRestoreSession = useCallback((token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      } as User;
    } catch (e) {
      console.error("Falha ao decodificar o token para restaurar a sessão:", e);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = decodeAndRestoreSession(token);
      if (userData) {
        // Usa a função login para setar o estado, mas sem precisar decodificar novamente
        login(token, userData);
      } else {
        logout();
      }
    }
  }, [getToken, decodeAndRestoreSession, login, logout]);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      getToken,
    }),
    [user, isAuthenticated, login, logout, getToken]
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
