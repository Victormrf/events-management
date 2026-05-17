"use client";

import { useLanguage } from "@/context/language-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  const toggle = () => setLocale(locale === "en" ? "pt" : "en");

  return (
    <button
      onClick={toggle}
      title={locale === "en" ? "Switch to Portuguese" : "Mudar para Inglês"}
      className="
        inline-flex items-center gap-1.5
        px-3 py-1.5
        rounded-full
        border border-border
        bg-background/60
        hover:bg-accent hover:text-primary
        text-xs font-bold uppercase tracking-widest
        transition-all duration-200
        select-none
      "
    >
      <span className={locale === "en" ? "text-primary" : "text-muted-foreground"}>
        EN
      </span>
      <span className="text-muted-foreground/40">|</span>
      <span className={locale === "pt" ? "text-primary" : "text-muted-foreground"}>
        PT
      </span>
    </button>
  );
}
