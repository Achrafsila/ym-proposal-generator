"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import { computeServiceTotal } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { numberFieldOptions } from "@/lib/form-helpers";
import type { ProposalFormValues } from "@/lib/proposal-schema";

function ServiceRowTotal({ index }: { index: number }) {
  const { watch } = useFormContext<ProposalFormValues>();
  const quantity = watch(`services.${index}.quantity`);
  const unitPrice = watch(`services.${index}.unitPrice`);
  const total = computeServiceTotal({ quantity: quantity || 0, unitPrice: unitPrice || 0 });

  return (
    <p className="mt-1 text-right text-sm font-medium text-foreground">
      Total : {formatCurrency(total)}
    </p>
  );
}

export function ServicesSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "services" });

  return (
    <SectionCard
      title="Prestations principales"
      description="Détaillez les prestations incluses dans l'offre principale."
    >
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_6rem_8rem_auto]">
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
                label="Prix unitaire (€)"
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
              <div className="flex items-end justify-end gap-1">
                <IconButton
                  type="button"
                  label="Monter la prestation"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  type="button"
                  label="Descendre la prestation"
                  onClick={() => move(index, index + 1)}
                  disabled={index === fields.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  type="button"
                  label="Supprimer la prestation"
                  variant="danger"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
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
            <ServiceRowTotal index={index} />
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "", description: "", quantity: 1, unitPrice: 0 })}
      >
        <Plus className="h-4 w-4" />
        Ajouter une prestation
      </Button>
    </SectionCard>
  );
}
