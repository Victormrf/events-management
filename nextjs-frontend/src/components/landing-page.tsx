import React from "react";
import { MapPin, Star, Plus, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-primary-100 overflow-hidden relative font-sans">
      {/* Elementos Decorativos de Fundo (Glows/Brilhos) */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-foreground/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full space-y-12 relative z-10">
        {/* Cabeçalho de Boas-vindas */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/10 border border-foreground/20 text-foreground text-xs font-bold uppercase tracking-widest animate-pulse">
            <Sparkles className="h-3.3 w-3.3" />
            Bem-vindo ao XploreHub
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-primary leading-tight">
            Sua próxima experiência <br className="hidden md:block" /> começa
            aqui.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Descubra eventos locais, explore destaques exclusivos ou crie seu
            próprio momento inesquecível com a nossa comunidade.
          </p>
        </div>

        {/* Grade de Opções Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opção 1: Encontrar Eventos Próximos (Ícone MapPin atualizado) */}
          <Link href="/discovery" className="group block h-full">
            <div className="relative h-full p-10 rounded-[2.5rem] border border-slate-800 bg-background/40 backdrop-blur-2xl hover:border-foreground/50 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col justify-between">
              {/* Ícone de Fundo Decorativo */}
              <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-700">
                <MapPin size={160} className="text-foreground" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-foreground/20 flex items-center justify-center border border-foreground/30 group-hover:scale-110 group-hover:bg-foreground/30 transition-all duration-500">
                  <MapPin className="h-7 w-7 text-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    Encontre eventos próximos a você
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    Utilize nosso mapa interativo e geolocalização para
                    descobrir experiências em um raio de 10km.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-foreground text-sm font-bold pt-6 group-hover:gap-4 transition-all">
                Explorar Mapa <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Opção 2: Eventos em Destaque */}
          <Link href="/events" className="group block h-full">
            <div className="relative h-full p-10 rounded-[2.5rem] border border-slate-800 bg-background/40 backdrop-blur-2xl hover:border-primary/50 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col justify-between">
              {/* Ícone de Fundo Decorativo */}
              <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-700">
                <Star size={160} className="text-primary" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-500">
                  <Star className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary/80">
                    Visualize os eventos em destaque
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    Confira a seleção curada dos eventos mais populares e
                    recomendados por nossa comunidade global.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-primary text-sm font-bold pt-6 group-hover:gap-4 transition-all">
                Ver Destaques <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Opção 3: Criar Evento (Ícone Plus atualizado para estilo limpo) */}
        <div className="flex justify-center pt-6">
          <Link href="/create-event" className="group w-full max-w-3xl">
            <div className="relative p-8 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/30 backdrop-blur-xl hover:border-foreground/30 transition-all duration-300 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 group">
              {/* Brilho interno sutil */}
              <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>

              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-foreground/20 border border-foreground/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)] group-hover:bg-foreground transition-all duration-500">
                  <Plus className="h-8 w-8 text-foreground group-hover:text-[#020617] group-hover:rotate-90 transition-all duration-500" />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="font-bold text-xl text-foreground mb-1">
                    Quer organizar seu próprio evento?
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Transforme sua ideia em realidade e conecte-se com pessoas
                    próximas em minutos.
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <button className="px-8 py-3.5 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-wider hover:bg-primary/80 hover:scale-105 transition-all shadow-xl shadow-black/20">
                  Começar Agora
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
