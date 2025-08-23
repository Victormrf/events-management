import { User } from "./user";

export interface LoginResponse {
  access_token: string;
}

export interface DecodedToken {
  email: string;
  sub: string;
  role: string;
  exp: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}
