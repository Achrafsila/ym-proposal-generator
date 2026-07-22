"use client";

import { FileText, LayoutTemplate, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Monogram } from "@/components/ui/monogram";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Nouvelle proposition", href: "/", icon: Sparkles },
  { label: "Prestations", href: "/services", icon: FileText },
  { label: "Modules complémentaires", href: "/options", icon: Package },
  { label: "Modèles", href: "/templates", icon: LayoutTemplate },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-card/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Monogram />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{siteConfig.name}</span>
            <span className="text-xs text-muted-foreground">{siteConfig.productName}</span>
          </div>
        </div>
        <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
