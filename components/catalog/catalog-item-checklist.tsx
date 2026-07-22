"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CatalogItem } from "@/features/catalog/types";
import { UNIT_LABELS } from "@/features/catalog/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CatalogItemChecklistProps {
  items: CatalogItem[];
  categories: readonly string[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  emptyLabel?: string;
}

export function CatalogItemChecklist({
  items,
  categories,
  selectedIds,
  onToggle,
  emptyLabel,
}: CatalogItemChecklistProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = query === "" || item.name.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher…"
          aria-label="Rechercher"
          className="sm:flex-1"
        />
        <Select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filtrer par catégorie"
          className="sm:max-w-[12rem]"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-2">
        {filtered.length === 0 && (
          <p className="p-4 text-center text-sm text-muted-foreground">
            {emptyLabel ?? "Aucun résultat."}
          </p>
        )}
        {filtered.map((item) => {
          const isChecked = selectedIds.includes(item.id);
          return (
            <label
              key={item.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
                isChecked && "bg-accent/10"
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(item.id)}
                className="mt-1 h-4 w-4 rounded border-border text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
              <span className="flex flex-1 flex-col">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(item.recommendedPrice)}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.category} · {UNIT_LABELS[item.unit]}
                </span>
                {item.shortDescription && (
                  <span className="text-xs text-muted-foreground">{item.shortDescription}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
