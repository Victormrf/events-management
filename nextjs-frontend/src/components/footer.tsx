"use client";

import { Github, Mail, Linkedin } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/XploreHub_logo.png"
                alt="XploreHub Logo"
                width={32}
                height={32}
              />
              <span className="font-bold text-primary">XploreHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          {/* Social */}
          <div className="space-y-4 md:text-right md:items-end flex flex-col">
            <h4 className="font-semibold text-secondary">{t.footer.connect}</h4>
            <div className="flex gap-2">
              <a
                href="https://www.linkedin.com/in/victor-manuel-fernandes/"
                className="p-2 rounded-md bg-background hover:bg-accent hover:text-primary  transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/Victormrf"
                className="p-2 rounded-md bg-background hover:bg-accent hover:text-primary  transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="vmrf2000@hotmail.com"
                className="p-2 rounded-md bg-background hover:bg-accent hover:text-primary  transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
