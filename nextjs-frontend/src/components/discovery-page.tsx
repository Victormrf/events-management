"use client";

import DiscoveryMap from "@/components/discovery-map";
import { useEvents } from "@/hooks/useEvents"; // Hook que busca todos os eventos públicos
import { Loader2, AlertCircle, Map as MapIcon, Info } from "lucide-react";

export default function DiscoveryPage() {
  const { events, loading, error } = useEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MapIcon className="h-8 w-8 text-primary" />
              Eventos próximos a você
            </h1>
            <p className="text-muted-foreground">
              Encontre todos os eventos em um raio de 10km da sua localização
              atual.
            </p>
          </div>
        </div>

        {/* 2. Tratamento de Estados (Loading/Error) */}
        {loading ? (
          <div className="flex h-[450px] w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground font-medium">
              Buscando eventos e calculando distâncias...
            </p>
          </div>
        ) : error ? (
          <div className="flex h-[450px] w-full flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive p-6 text-center">
            <AlertCircle className="h-10 w-10 mb-4" />
            <p className="font-bold text-lg">
              Não foi possível carregar o mapa
            </p>
            <p className="text-sm opacity-90 max-w-md">
              Ocorreu um erro ao tentar buscar os eventos: {error}. Por favor,
              verifique sua conexão ou tente novamente mais tarde.
            </p>
          </div>
        ) : (
          /* 3. Renderização do Mapa com a lista de eventos injetada */
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <DiscoveryMap events={events} />
          </div>
        )}

        {/* Seção Informativa de Apoio */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-4">
          <div className="rounded-xl border p-5 bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <MapIcon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Como funciona?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos a geolocalização do seu navegador para encontrar sua
              posição e cruzar com as coordenadas dos eventos.
            </p>
          </div>

          <div className="rounded-xl border p-5 bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Privacidade</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sua posição é processada localmente para o cálculo do raio de 10km
              e não é armazenada de forma permanente em nossos servidores.
            </p>
          </div>

          <div className="rounded-xl border p-5 bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold">Sem resultados?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Certifique-se de que permitiu o acesso à localização. Se o mapa
              estiver vazio, pode não haver eventos ativos nesta região no
              momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
