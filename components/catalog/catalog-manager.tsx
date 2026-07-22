"use client";

import { Copy, Pencil, Plus, Power, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { CatalogItemFormModal } from "@/components/catalog/catalog-item-form-modal";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CatalogItemFormValues } from "@/features/catalog/catalog-item-schema";
import type { CatalogStorage } from "@/features/catalog/services/catalog-storage";
import type { CatalogItem } from "@/features/catalog/types";
import { UNIT_LABELS } from "@/features/catalog/types";
import { useCatalogStorage } from "@/features/catalog/use-catalog-storage";
import { formatCurrency } from "@/lib/format";
import { fadeInUp, staggerContainer, transitionSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CatalogManagerProps {
  storage: CatalogStorage;
  categories: readonly string[];
  title: string;
  description: string;
  itemLabel: string;
  addButtonLabel: string;
}

export function CatalogManager({
  storage,
  categories,
  title,
  description,
  itemLabel,
  addButtonLabel,
}: CatalogManagerProps) {
  const { items, add, update, duplicate, remove, setActive } = useCatalogStorage(storage);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalState, setModalState] = useState<{ open: boolean; item: CatalogItem | null }>({
    open: false,
    item: null,
  });

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = query === "" || item.name.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  function handleModalSubmit(values: CatalogItemFormValues) {
    if (modalState.item) {
      update(modalState.item.id, values);
    } else {
      add(values);
    }
    setModalState({ open: false, item: null });
  }

  function handleRemove(item: CatalogItem) {
    const confirmed = window.confirm(
      `Supprimer « ${item.name} » de la bibliothèque ? Cette action est définitive.`
    );
    if (!confirmed) return;
    remove(item.id);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher…"
              className="pl-9"
              aria-label="Rechercher"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filtrer par catégorie"
            className="sm:max-w-[13rem]"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
        <Button type="button" onClick={() => setModalState({ open: true, item: null })}>
          <Plus className="h-4 w-4" />
          {addButtonLabel}
        </Button>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {filteredItems.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucun résultat.
          </p>
        )}
        <AnimatePresence initial={false}>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.98, transition: transitionSnappy }}
              whileHover={{ y: -2 }}
              transition={transitionSnappy}
              className={cn(
                "flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors duration-200 hover:border-border-strong hover:bg-card-hover",
                !item.isActive && "opacity-50"
              )}
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{item.name}</span>
                  {!item.isActive && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Inactif
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.category} · {UNIT_LABELS[item.unit]} · {formatCurrency(item.recommendedPrice)}
                </p>
                {item.shortDescription && (
                  <p className="text-sm text-muted-foreground">{item.shortDescription}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IconButton
                  label={item.isActive ? "Désactiver" : "Activer"}
                  onClick={() => setActive(item.id, !item.isActive)}
                >
                  <Power className="h-4 w-4" />
                </IconButton>
                <IconButton label="Dupliquer" onClick={() => duplicate(item.id)}>
                  <Copy className="h-4 w-4" />
                </IconButton>
                <IconButton label="Modifier" onClick={() => setModalState({ open: true, item })}>
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton label="Supprimer" variant="danger" onClick={() => handleRemove(item)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <CatalogItemFormModal
        open={modalState.open}
        onClose={() => setModalState({ open: false, item: null })}
        categories={categories}
        itemLabel={itemLabel}
        initialItem={modalState.item}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
