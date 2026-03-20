"use client";

import { EventCard } from "@/components/event-card";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types/event";
import { useState } from "react";
import { Search } from "lucide-react";

export function EventsList() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { events } = useEvents();

  console.log("Fetched events:", events.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length === 0 ? (
        <div className="col-span-full flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="bg-muted rounded-full p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                No events found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Check back later for upcoming events
              </p>
            </div>
          </div>
        </div>
      ) : (
        events.map((event: Event) => (
          <EventCard
            key={event.id}
            event={event}
            isExpanded={expandedId === event.id}
            onExpand={() => setExpandedId(event.id)}
            onCollapse={() => setExpandedId(null)}
            isDimmed={!!expandedId && expandedId !== event.id}
          />
        ))
      )}
    </div>
  );
}
