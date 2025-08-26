"use client";

import { useAuth } from "@/context/auth-provider";
import Link from "next/link";

export function HeaderNav() {
  const { isAuthenticated } = useAuth();
  return (
    <nav className="hidden md:flex items-center gap-6">
      {isAuthenticated && (
        <>
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Events
          </Link>
          <Link
            href="/create-event"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Create Event
          </Link>
          <Link
            href="/my-events"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            My Events
          </Link>
        </>
      )}
    </nav>
  );
}
