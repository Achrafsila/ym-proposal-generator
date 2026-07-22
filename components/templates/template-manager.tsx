"use client";

import { Copy, FileText, Pencil, Play, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { TemplateFormModal } from "@/components/templates/template-form-modal";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { serviceLibraryStorage } from "@/features/catalog/services/service-library-storage";
import { optionLibraryStorage } from "@/features/catalog/services/option-library-storage";
import { useCatalogStorage } from "@/features/catalog/use-catalog-storage";
import type { TemplateFormValues } from "@/features/templates/template-form-schema";
import type { ProposalTemplate } from "@/features/templates/types";
import { useTemplateStorage } from "@/features/templates/use-template-storage";
import { fadeInUp, staggerContainer, transitionSnappy } from "@/lib/motion";

export function TemplateManager() {
  const { templates, add, update, duplicate, remove } = useTemplateStorage();
  const { items: serviceCatalog } = useCatalogStorage(serviceLibraryStorage);
  const { items: optionCatalog } = useCatalogStorage(optionLibraryStorage);
  const [modalState, setModalState] = useState<{ open: boolean; template: ProposalTemplate | null }>(
    { open: false, template: null }
  );

  const activeServices = serviceCatalog.filter((item) => item.isActive);
  const activeOptions = optionCatalog.filter((item) => item.isActive);

  function handleSubmit(values: TemplateFormValues, serviceIds: string[], optionIds: string[]) {
    const payload = { ...values, serviceIds, optionIds };
    if (modalState.template) {
      update(modalState.template.id, payload);
    } else {
      add(payload);
    }
    setModalState({ open: false, template: null });
  }

  function handleRemove(template: ProposalTemplate) {
    const confirmed = window.confirm(
      `Supprimer le modèle « ${template.name} » ? Cette action est définitive.`
    );
    if (!confirmed) return;
    remove(template.id);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Modèles
          </h1>
          <p className="text-sm text-muted-foreground">
            Préremplissez une nouvelle proposition à partir d&apos;un modèle par secteur.
          </p>
        </div>
        <Button type="button" onClick={() => setModalState({ open: true, template: null })}>
          <FileText className="h-4 w-4" />
          Créer un modèle
        </Button>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {templates.map((template) => (
          <motion.div
            key={template.id}
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            transition={transitionSnappy}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors duration-300 hover:border-accent/40"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="relative flex flex-col gap-2">
              <span className="inline-flex w-fit items-center rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-accent-soft">
                {template.sector}
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {template.name}
              </h2>
            </div>

            <p className="relative line-clamp-3 text-sm text-muted-foreground">
              {template.projectContext || "Aucune présentation par défaut."}
            </p>

            <p className="relative text-xs text-muted-foreground">
              {template.serviceIds.length} prestation(s) · {template.optionIds.length} option(s)
            </p>

            <div className="relative mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
              <Link href={`/?useTemplate=${template.id}`}>
                <Button type="button" variant="primary" className="text-sm">
                  <Play className="h-4 w-4" />
                  Utiliser ce modèle
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                <IconButton label="Dupliquer" onClick={() => duplicate(template.id)}>
                  <Copy className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Modifier"
                  onClick={() => setModalState({ open: true, template })}
                >
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton label="Supprimer" variant="danger" onClick={() => handleRemove(template)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <TemplateFormModal
        open={modalState.open}
        onClose={() => setModalState({ open: false, template: null })}
        initialTemplate={modalState.template}
        serviceCatalog={activeServices}
        optionCatalog={activeOptions}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
