import { Calendar, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Events Manager</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
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
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              Sign In
            </Button>
            <Button className="hidden sm:flex">Sign Up</Button>
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
