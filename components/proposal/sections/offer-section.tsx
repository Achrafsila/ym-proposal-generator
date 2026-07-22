"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { CatalogPickerModal } from "@/components/catalog/catalog-picker-modal";
import { Button } from "@/components/ui/button";
import { CollapsibleRow } from "@/components/ui/collapsible-row";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import { serviceLibraryStorage } from "@/features/catalog/services/service-library-storage";
import type { CatalogItem } from "@/features/catalog/types";
import { SERVICE_CATEGORIES } from "@/features/catalog/types";
import { useCatalogStorage } from "@/features/catalog/use-catalog-storage";
import { catalogItemToServiceItem } from "@/features/proposal/catalog-to-proposal-item";
import { computeServiceTotal } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { numberFieldOptions } from "@/lib/form-helpers";
import type { ProposalFormValues } from "@/lib/proposal-schema";

interface ServiceRowProps {
  index: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function ServiceRow({
  index,
  isOpen,
  onToggleOpen,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: ServiceRowProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();
  const name = watch(`services.${index}.name`);
  const quantity = watch(`services.${index}.quantity`);
  const unitPrice = watch(`services.${index}.unitPrice`);
  const total = computeServiceTotal({ quantity: quantity || 0, unitPrice: unitPrice || 0 });

  return (
    <CollapsibleRow
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRemove={onRemove}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      editLabel="Modifier la prestation"
      removeLabel="Supprimer la prestation"
      moveUpLabel="Monter la prestation"
      moveDownLabel="Descendre la prestation"
      summary={
        <div className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">
            {name || "Prestation sans nom"}
          </span>
          <span className="text-xs text-muted-foreground">
            {quantity || 0} × {formatCurrency(unitPrice || 0)} = {formatCurrency(total)}
          </span>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_6rem_8rem]">
        <FormField
          label="Nom de la prestation"
          htmlFor={`services.${index}.name`}
          error={errors.services?.[index]?.name?.message}
        >
          <Input id={`services.${index}.name`} {...register(`services.${index}.name`)} />
        </FormField>
        <FormField
          label="Quantité"
          htmlFor={`services.${index}.quantity`}
          error={errors.services?.[index]?.quantity?.message}
        >
          <Input
            id={`services.${index}.quantity`}
            type="number"
            min={0}
            step={1}
            {...register(`services.${index}.quantity`, numberFieldOptions())}
          />
        </FormField>
        <FormField
          label="Prix unitaire (MAD)"
          htmlFor={`services.${index}.unitPrice`}
          error={errors.services?.[index]?.unitPrice?.message}
        >
          <Input
            id={`services.${index}.unitPrice`}
            type="number"
            min={0}
            step={0.01}
            {...register(`services.${index}.unitPrice`, numberFieldOptions())}
          />
        </FormField>
      </div>
      <FormField
        label="Description courte"
        htmlFor={`services.${index}.description`}
        className="mt-3"
      >
        <Textarea
          id={`services.${index}.description`}
          rows={2}
          {...register(`services.${index}.description`)}
        />
      </FormField>
    </CollapsibleRow>
  );
}

export function OfferSection() {
  const { control } = useFormContext<ProposalFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "services" });
  const { items: catalog } = useCatalogStorage(serviceLibraryStorage);
  const activeCatalog = catalog.filter((item) => item.isActive);
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const [isPickerOpen, setPickerOpen] = useState(false);

  function toggleRow(id: string) {
    setOpenRows((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handlePickerConfirm(selected: CatalogItem[]) {
    selected.forEach((item) => append(catalogItemToServiceItem(item)));
  }

  return (
    <SectionCard
      title="Offre sélectionnée"
      description="Ajoutez des prestations depuis la bibliothèque YM Studio, puis personnalisez-les si besoin."
    >
      <div className="flex flex-col gap-3">
        {fields.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aucune prestation ajoutée pour le moment.
          </p>
        )}
        {fields.map((field, index) => (
          <ServiceRow
            key={field.id}
            index={index}
            isOpen={openRows.has(field.id)}
            onToggleOpen={() => toggleRow(field.id)}
            onMoveUp={() => move(index, index - 1)}
            onMoveDown={() => move(index, index + 1)}
            onRemove={() => remove(index)}
            canMoveUp={index > 0}
            canMoveDown={index < fields.length - 1}
          />
        ))}
      </div>

      <Button type="button" onClick={() => setPickerOpen(true)}>
        <Plus className="h-4 w-4" />
        Ajouter des prestations
      </Button>

      <CatalogPickerModal
        open={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Ajouter des prestations"
        description="Sélectionnez une ou plusieurs prestations à ajouter à l'offre."
        items={activeCatalog}
        categories={SERVICE_CATEGORIES}
        onConfirm={handlePickerConfirm}
        confirmLabelPrefix="Ajouter la sélection"
      />
    </SectionCard>
  );
}
