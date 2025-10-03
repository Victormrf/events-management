import { Github, Twitter, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
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
              Discover and manage amazing events in your area.
            </p>
          </div>

          {/* Social */}
          <div className="space-y-4 md:text-right md:items-end flex flex-col">
            <h4 className="font-semibold text-secondary">Connect</h4>
            <div className="flex gap-2">
              <a
                href="#"
                className="p-2 rounded-md bg-background hover:bg-accent transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md bg-background hover:bg-accent transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md bg-background hover:bg-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Victor Fernandes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
