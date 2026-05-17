"use client";

import { useAuth } from "@/context/auth-provider";
import { useLanguage } from "@/context/language-provider";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { MapPin, Star } from "lucide-react";

export function HeaderNav() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const eventsRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        eventsRef.current &&
        !eventsRef.current.contains(event.target as Node)
      ) {
        setIsEventsOpen(false);
      }
    }

    if (isEventsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isEventsOpen]);

  return (
    <nav className="hidden md:flex items-center gap-6">
      {isAuthenticated && (
        <>
          <div className="relative" ref={eventsRef}>
            <button
              onClick={() => setIsEventsOpen(!isEventsOpen)}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t.nav.events}
            </button>

            {isEventsOpen && (
              <div className="absolute top-full mt-2 left-0 bg-background border border-background-200 rounded-lg shadow-lg z-50 min-w-max">
                <Link
                  href="/discovery"
                  onClick={() => setIsEventsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-background-50 transition-colors border-b border-background-200 last:border-b-0"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {t.nav.discoverExperiences}
                  </span>
                </Link>
                <Link
                  href="/events"
                  onClick={() => setIsEventsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-background-50 transition-colors"
                >
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {t.nav.browseEvents}
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/create-event"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t.nav.createEvent}
          </Link>
          <Link
            href="/my-events"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t.nav.myEvents}
          </Link>
          <Link
            href="/my-registrations"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t.nav.myRegistrations}
          </Link>
        </>
      )}
    </nav>
  );
}
