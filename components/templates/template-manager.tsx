"use client";

import { Copy, FileText, Pencil, Play, Trash2 } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">Modèles</h1>
          <p className="text-sm text-muted-foreground">
            Préremplissez une nouvelle proposition à partir d&apos;un modèle par secteur.
          </p>
        </div>
        <Button type="button" onClick={() => setModalState({ open: true, template: null })}>
          <FileText className="h-4 w-4" />
          Créer un modèle
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-accent">
                {template.sector}
              </span>
              <h2 className="text-base font-semibold text-foreground">{template.name}</h2>
            </div>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {template.projectContext || "Aucune présentation par défaut."}
            </p>
            <p className="text-xs text-muted-foreground">
              {template.serviceIds.length} prestation(s) · {template.optionIds.length} option(s)
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <Link href={`/?useTemplate=${template.id}`}>
                <Button type="button" variant="primary" className="text-sm">
                  <Play className="h-4 w-4" />
                  Utiliser ce modèle
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                <IconButton
                  label="Dupliquer"
                  onClick={() => duplicate(template.id)}
                >
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
          </div>
        ))}
      </div>

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
