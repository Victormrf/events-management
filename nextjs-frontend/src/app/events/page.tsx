import { EventsList } from "@/components/events-list";

export default function FeaturedEventsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Page header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="text-muted-foreground">
            Check out the hottest events happening around the world.
          </p>
        </div>

        {/* Events list */}
        <EventsList />
      </div>
    </div>
  );
}
