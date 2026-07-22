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
import { optionLibraryStorage } from "@/features/catalog/services/option-library-storage";
import type { CatalogItem } from "@/features/catalog/types";
import { OPTION_CATEGORIES } from "@/features/catalog/types";
import { useCatalogStorage } from "@/features/catalog/use-catalog-storage";
import { catalogItemToOptionItem } from "@/features/proposal/catalog-to-proposal-item";
import { formatCurrency } from "@/lib/format";
import { numberFieldOptions } from "@/lib/form-helpers";
import type { ProposalFormValues } from "@/lib/proposal-schema";

interface OptionRowProps {
  index: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function OptionRow({
  index,
  isOpen,
  onToggleOpen,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: OptionRowProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();
  const name = watch(`options.${index}.name`);
  const price = watch(`options.${index}.price`);
  const selected = watch(`options.${index}.selected`);

  return (
    <CollapsibleRow
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onRemove={onRemove}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      editLabel="Modifier l'option"
      removeLabel="Supprimer l'option"
      moveUpLabel="Monter l'option"
      moveDownLabel="Descendre l'option"
      summary={
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            aria-label={`Inclure « ${name || "cette option"} » dans le prix`}
            className="h-4 w-4 shrink-0 rounded border-border text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            {...register(`options.${index}.selected`)}
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-foreground">
              {name || "Option sans nom"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatCurrency(price || 0)} ·{" "}
              {selected ? "Incluse dans le prix" : "Non incluse (possibilité future)"}
            </span>
          </div>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
        <FormField
          label="Nom de l'option"
          htmlFor={`options.${index}.name`}
          error={errors.options?.[index]?.name?.message}
        >
          <Input id={`options.${index}.name`} {...register(`options.${index}.name`)} />
        </FormField>
        <FormField
          label="Prix (MAD)"
          htmlFor={`options.${index}.price`}
          error={errors.options?.[index]?.price?.message}
        >
          <Input
            id={`options.${index}.price`}
            type="number"
            min={0}
            step={0.01}
            {...register(`options.${index}.price`, numberFieldOptions())}
          />
        </FormField>
      </div>
      <FormField label="Description" htmlFor={`options.${index}.description`} className="mt-3">
        <Textarea
          id={`options.${index}.description`}
          rows={2}
          {...register(`options.${index}.description`)}
        />
      </FormField>
    </CollapsibleRow>
  );
}

export function OptionsSection() {
  const { control } = useFormContext<ProposalFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "options" });
  const { items: catalog } = useCatalogStorage(optionLibraryStorage);
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
    selected.forEach((item) => append(catalogItemToOptionItem(item, true)));
  }

  return (
    <SectionCard
      title="Options complémentaires"
      step={4}
      description="Seules les options cochées « incluse » sont ajoutées au total du devis."
    >
      <div className="flex flex-col gap-3">
        {fields.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aucune option ajoutée pour le moment.
          </p>
        )}
        {fields.map((field, index) => (
          <OptionRow
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
        Ajouter des options
      </Button>

      <CatalogPickerModal
        open={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Ajouter des options"
        description="Sélectionnez un ou plusieurs modules complémentaires."
        items={activeCatalog}
        categories={OPTION_CATEGORIES}
        onConfirm={handlePickerConfirm}
        confirmLabelPrefix="Ajouter la sélection"
      />
    </SectionCard>
  );
}
