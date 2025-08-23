import { AuthContextType, DecodedToken } from "@/types/auth";
import { User } from "@/types/user";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const decodeToken = useCallback((token: string): DecodedToken | null => {
    try {
      // Nota: Em uma aplicação real, você usaria uma biblioteca como 'jwt-decode'
      // para decodificar o token e obter as informações do usuário.
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (e) {
      console.error("Falha ao decodificar o token:", e);
      return null;
    }
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(
    (token: string) => {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      const decoded = decodeToken(token);
      if (decoded) {
        setUser({
          id: decoded.sub,
          email: decoded.email,
          name: "Usuário",
          role: decoded.role,
        });
        setIsAuthenticated(true);
      } else {
        logout();
      }
    },
    [decodeToken, logout]
  );

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        login(token); // Tenta logar automaticamente se o token for válido
      } else {
        logout();
      }
    }
  }, [getToken, decodeToken, login, logout]);

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
