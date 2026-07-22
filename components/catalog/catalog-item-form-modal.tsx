"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleField } from "@/components/ui/toggle-field";
import {
  catalogItemFormSchema,
  type CatalogItemFormValues,
} from "@/features/catalog/catalog-item-schema";
import { UNIT_LABELS } from "@/features/catalog/types";
import type { CatalogItem, CatalogItemUnit } from "@/features/catalog/types";
import { numberFieldOptions } from "@/lib/form-helpers";

const UNIT_OPTIONS: CatalogItemUnit[] = ["fixed", "item", "page", "month", "year"];

interface CatalogItemFormModalProps {
  open: boolean;
  onClose: () => void;
  categories: readonly string[];
  itemLabel: string;
  initialItem?: CatalogItem | null;
  onSubmit: (values: CatalogItemFormValues) => void;
}

function toFormValues(item?: CatalogItem | null): CatalogItemFormValues {
  return {
    name: item?.name ?? "",
    category: item?.category ?? "",
    shortDescription: item?.shortDescription ?? "",
    pdfDescription: item?.pdfDescription ?? "",
    recommendedPrice: item?.recommendedPrice ?? 0,
    unit: item?.unit ?? "fixed",
    isActive: item?.isActive ?? true,
  };
}

export function CatalogItemFormModal({
  open,
  onClose,
  categories,
  itemLabel,
  initialItem,
  onSubmit,
}: CatalogItemFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CatalogItemFormValues>({
    resolver: zodResolver(catalogItemFormSchema),
    defaultValues: toFormValues(initialItem),
  });

  useEffect(() => {
    if (open) reset(toFormValues(initialItem));
  }, [open, initialItem, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialItem ? `Modifier ${itemLabel}` : `Ajouter ${itemLabel}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Nom" htmlFor="catalog-item-name" required error={errors.name?.message}>
          <Input id="catalog-item-name" {...register("name")} />
        </FormField>
        <FormField
          label="Catégorie"
          htmlFor="catalog-item-category"
          required
          error={errors.category?.message}
        >
          <Select id="catalog-item-category" {...register("category")}>
            <option value="">Sélectionner…</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Description courte (usage interne)" htmlFor="catalog-item-short-description">
          <Textarea id="catalog-item-short-description" rows={2} {...register("shortDescription")} />
        </FormField>
        <FormField
          label="Description destinée au PDF"
          htmlFor="catalog-item-pdf-description"
          hint="Ce texte apparaît sur la proposition envoyée au client."
        >
          <Textarea id="catalog-item-pdf-description" rows={2} {...register("pdfDescription")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Prix recommandé (MAD)"
            htmlFor="catalog-item-price"
            error={errors.recommendedPrice?.message}
          >
            <Input
              id="catalog-item-price"
              type="number"
              min={0}
              step={0.01}
              {...register("recommendedPrice", numberFieldOptions())}
            />
          </FormField>
          <FormField label="Unité de facturation" htmlFor="catalog-item-unit">
            <Select id="catalog-item-unit" {...register("unit")}>
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {UNIT_LABELS[unit]}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <ToggleField
          label="Actif"
          description="Les éléments inactifs n'apparaissent plus dans le sélecteur de la proposition."
          {...register("isActive")}
        />
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">{initialItem ? "Enregistrer" : "Ajouter"}</Button>
        </div>
      </form>
    </Modal>
  );
}
