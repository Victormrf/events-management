"use client";

import { EventCard } from "@/components/event-card";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types/event";
import { useState } from "react";

export function EventsList() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { events } = useEvents();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event: Event) => (
        <EventCard
          key={event.id}
          event={event}
          isExpanded={expandedId === event.id}
          onExpand={() => setExpandedId(event.id)}
          onCollapse={() => setExpandedId(null)}
          isDimmed={!!expandedId && expandedId !== event.id}
        />
      ))}
    </div>
  );
}
