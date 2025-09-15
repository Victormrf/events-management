import { MyRegistrationsList } from "@/components/my-registrations-list";

export default function MyRegistrationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minhas Inscrições</h1>
            <p className="text-muted-foreground">
              Eventos em que você se inscreveu
            </p>
          </div>
        </div>
        <MyRegistrationsList />
      </div>
    </div>
  );
}
