import { MyEventsList } from "@/components/my-events-list";

export default function MyEventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meus Eventos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os eventos que você criou
            </p>
          </div>
        </div>
        <MyEventsList />
      </div>
    </div>
  );
}
