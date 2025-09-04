import { User } from "./user";

export interface LoginResponse {
  access_token: string;
}

export interface DecodedToken {
  email: string;
  name: string;
  sub: string;
  role: string;
  exp: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  getToken: () => string | undefined;
  isLoading: boolean;
}

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};
