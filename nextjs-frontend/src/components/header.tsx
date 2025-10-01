import { Calendar } from "lucide-react";
import Link from "next/link";
import { HeaderNav } from "./header-nav";
import { HeaderActions } from "./header-actions";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">
              Events Manager
            </span>
          </Link>

          {/* Desktop navigation */}
          <HeaderNav />

          {/* Actions */}
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
