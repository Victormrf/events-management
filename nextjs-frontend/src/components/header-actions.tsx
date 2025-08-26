"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-provider";
import Link from "next/link";

export function HeaderActions() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="hidden sm:flex">
        <Search className="h-4 w-4" />
      </Button>
      {isAuthenticated && user ? (
        // Mostra o nome do usuário e um botão de logout se estiver autenticado
        <>
          <span className="hidden sm:flex text-sm font-medium">
            Olá, {user.name}
          </span>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="hidden sm:flex bg-transparent"
          >
            Sair
          </Button>
        </>
      ) : (
        // Mostra os botões de login e registro se não estiver autenticado
        <>
          <Link href="/login">
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              Entrar
            </Button>
          </Link>
        </>
      )}
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-4 w-4" />
      </Button>
    </div>
  );
}
