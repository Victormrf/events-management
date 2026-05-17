"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import { LanguageToggle } from "./language-toggle";
import Link from "next/link";

export function HeaderActions() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
  };

  if (typeof window === "undefined" || isLoading) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Language toggle — always visible */}
      <LanguageToggle />

      {isAuthenticated && user ? (
        <>
          <span className="hidden sm:flex text-sm font-medium">
            {t.auth.hello}, {user.name}
          </span>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="hidden sm:flex bg-transparent"
          >
            {t.auth.logout}
          </Button>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              {t.auth.loginSignup}
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
