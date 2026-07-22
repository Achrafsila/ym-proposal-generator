"use client";

import { FileText, LayoutTemplate, Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Monogram } from "@/components/ui/monogram";
import { siteConfig } from "@/config/site";
import { transitionSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Nouvelle proposition", href: "/", icon: Sparkles },
  { label: "Prestations", href: "/services", icon: FileText },
  { label: "Modules complémentaires", href: "/options", icon: Package },
  { label: "Modèles", href: "/templates", icon: LayoutTemplate },
];

function isItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/60 backdrop-blur-2xl md:flex">
        <div className="flex items-center gap-3 border-b border-border px-6 py-6">
          <Monogram />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
            <span className="text-xs text-muted-foreground">{siteConfig.productName}</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="app-nav-active"
                    transition={transitionSnappy}
                    className="absolute inset-0 rounded-xl border border-border-strong bg-gradient-to-r from-white/[0.07] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  />
                ) : (
                  <span className="absolute inset-0 rounded-xl bg-transparent transition-colors duration-200 group-hover:bg-white/[0.04]" />
                )}
                <Icon
                  className={cn(
                    "relative z-10 h-4 w-4 shrink-0",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,175,106,0.85)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-6 py-5">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Espace de travail
          </p>
          <p className="text-sm font-medium text-foreground">YM Studio</p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card/80 backdrop-blur-2xl md:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = isItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors duration-200",
                isActive ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate px-1">{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="app-nav-active-mobile"
                  transition={transitionSnappy}
                  className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-accent shadow-[0_0_8px_rgba(212,175,106,0.85)]"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
