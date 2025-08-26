import { CreateEventForm } from "@/components/create-event-form";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Criar Evento</h1>
          <p className="text-muted-foreground">
            Preencha os detalhes abaixo para criar seu evento
          </p>
        </div>
        <CreateEventForm />
      </div>
    </div>
  );
}
