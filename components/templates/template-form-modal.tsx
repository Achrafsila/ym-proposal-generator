"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { CatalogItemChecklist } from "@/components/catalog/catalog-item-checklist";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_CATEGORIES } from "@/features/catalog/types";
import type { CatalogItem } from "@/features/catalog/types";
import {
  templateFormSchema,
  type TemplateFormValues,
} from "@/features/templates/template-form-schema";
import type { ProposalTemplate } from "@/features/templates/types";
import { numberFieldOptions } from "@/lib/form-helpers";

interface TemplateFormModalProps {
  open: boolean;
  onClose: () => void;
  initialTemplate?: ProposalTemplate | null;
  serviceCatalog: CatalogItem[];
  optionCatalog: CatalogItem[];
  onSubmit: (values: TemplateFormValues, serviceIds: string[], optionIds: string[]) => void;
}

function toFormValues(template?: ProposalTemplate | null): TemplateFormValues {
  return {
    name: template?.name ?? "",
    sector: template?.sector ?? "",
    projectTitle: template?.projectTitle ?? "",
    projectContext: template?.projectContext ?? "",
    projectObjectives: template?.projectObjectives ?? "",
    timeline: template?.timeline ?? "",
    terms: {
      paymentTerms: template?.terms.paymentTerms ?? "",
      revisionsIncluded: template?.terms.revisionsIncluded ?? "",
      hostingDuration: template?.terms.hostingDuration ?? "",
      maintenanceSupport: template?.terms.maintenanceSupport ?? "",
      additionalNotes: template?.terms.additionalNotes ?? "",
    },
    financialDefaults: {
      tvaRate: template?.financialDefaults.tvaRate ?? 20,
      depositType: template?.financialDefaults.depositType ?? "percent",
      depositValue: template?.financialDefaults.depositValue ?? 50,
      showPriceDetails: template?.financialDefaults.showPriceDetails ?? true,
    },
  };
}

export function TemplateFormModal({
  open,
  onClose,
  initialTemplate,
  serviceCatalog,
  optionCatalog,
  onSubmit,
}: TemplateFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: toFormValues(initialTemplate),
  });

  const [serviceIds, setServiceIds] = useState<string[]>(initialTemplate?.serviceIds ?? []);
  const [optionIds, setOptionIds] = useState<string[]>(initialTemplate?.optionIds ?? []);

  useEffect(() => {
    if (open) {
      reset(toFormValues(initialTemplate));
      setServiceIds(initialTemplate?.serviceIds ?? []);
      setOptionIds(initialTemplate?.optionIds ?? []);
    }
  }, [open, initialTemplate, reset]);

  const depositType = watch("financialDefaults.depositType");
  const showPriceDetails = watch("financialDefaults.showPriceDetails");

  function toggleService(id: string) {
    setServiceIds((previous) =>
      previous.includes(id) ? previous.filter((existing) => existing !== id) : [...previous, id]
    );
  }

  function toggleOption(id: string) {
    setOptionIds((previous) =>
      previous.includes(id) ? previous.filter((existing) => existing !== id) : [...previous, id]
    );
  }

  function handleFormSubmit(values: TemplateFormValues) {
    onSubmit(values, serviceIds, optionIds);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialTemplate ? "Modifier le modèle" : "Créer un modèle"}
      widthClassName="sm:w-[44rem]"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nom du modèle" htmlFor="template-name" required error={errors.name?.message}>
            <Input id="template-name" {...register("name")} />
          </FormField>
          <FormField label="Secteur" htmlFor="template-sector" required error={errors.sector?.message}>
            <Input id="template-sector" {...register("sector")} />
          </FormField>
        </div>

        <FormField label="Intitulé de proposition par défaut" htmlFor="template-project-title">
          <Input id="template-project-title" {...register("projectTitle")} />
        </FormField>
        <FormField label="Présentation du besoin par défaut" htmlFor="template-project-context">
          <Textarea id="template-project-context" rows={3} {...register("projectContext")} />
        </FormField>
        <FormField label="Objectifs par défaut" htmlFor="template-project-objectives">
          <Textarea id="template-project-objectives" rows={3} {...register("projectObjectives")} />
        </FormField>
        <FormField label="Délai estimatif" htmlFor="template-timeline">
          <Input id="template-timeline" {...register("timeline")} />
        </FormField>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">Prestations incluses</span>
          <CatalogItemChecklist
            items={serviceCatalog}
            categories={SERVICE_CATEGORIES}
            selectedIds={serviceIds}
            onToggle={toggleService}
            emptyLabel="Aucune prestation active dans la bibliothèque."
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">Options recommandées</span>
          <CatalogItemChecklist
            items={optionCatalog}
            categories={SERVICE_CATEGORIES}
            selectedIds={optionIds}
            onToggle={toggleOption}
            emptyLabel="Aucun module actif dans la bibliothèque."
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">Conditions commerciales</span>
          <FormField label="Modalités de paiement" htmlFor="template-payment-terms">
            <Textarea id="template-payment-terms" rows={2} {...register("terms.paymentTerms")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Modifications incluses" htmlFor="template-revisions">
              <Input id="template-revisions" {...register("terms.revisionsIncluded")} />
            </FormField>
            <FormField label="Durée de l'hébergement" htmlFor="template-hosting">
              <Input id="template-hosting" {...register("terms.hostingDuration")} />
            </FormField>
          </div>
          <FormField label="Maintenance et support" htmlFor="template-maintenance">
            <Input id="template-maintenance" {...register("terms.maintenanceSupport")} />
          </FormField>
          <FormField label="Remarques complémentaires" htmlFor="template-notes">
            <Textarea id="template-notes" rows={2} {...register("terms.additionalNotes")} />
          </FormField>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">Réglages financiers</span>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Taux de TVA (%)"
              htmlFor="template-tva"
              error={errors.financialDefaults?.tvaRate?.message}
            >
              <Input
                id="template-tva"
                type="number"
                min={0}
                max={100}
                step={0.1}
                {...register("financialDefaults.tvaRate", numberFieldOptions())}
              />
            </FormField>
            <FormField
              label={depositType === "percent" ? "Acompte recommandé (%)" : "Acompte recommandé (MAD)"}
              htmlFor="template-deposit-value"
              error={errors.financialDefaults?.depositValue?.message}
            >
              <Input
                id="template-deposit-value"
                type="number"
                min={0}
                step={0.01}
                {...register("financialDefaults.depositValue", numberFieldOptions())}
              />
            </FormField>
          </div>
          <SegmentedToggle
            label="Type d'acompte recommandé"
            value={depositType}
            onChange={(value) => setValue("financialDefaults.depositType", value)}
            options={[
              { value: "percent", label: "Pourcentage (%)" },
              { value: "amount", label: "Montant (MAD)" },
            ]}
          />
          <SegmentedToggle
            label="Affichage des prix dans le PDF"
            value={showPriceDetails ? "detailed" : "global"}
            onChange={(value) => setValue("financialDefaults.showPriceDetails", value === "detailed")}
            options={[
              { value: "detailed", label: "Prix détaillés" },
              { value: "global", label: "Montant global" },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">{initialTemplate ? "Enregistrer" : "Créer le modèle"}</Button>
        </div>
      </form>
    </Modal>
  );
}
