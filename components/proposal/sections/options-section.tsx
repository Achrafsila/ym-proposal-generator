"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import { numberFieldOptions } from "@/lib/form-helpers";
import type { ProposalFormValues } from "@/lib/proposal-schema";

export function OptionsSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "options" });

  return (
    <SectionCard
      title="Options et évolutions possibles"
      description="Seules les options sélectionnées sont incluses dans le total du devis."
    >
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start gap-3">
              <input
                id={`options.${index}.selected`}
                type="checkbox"
                className="mt-7 h-4 w-4 shrink-0 rounded border-border text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                {...register(`options.${index}.selected`)}
                aria-label="Inclure cette option dans le total"
              />
              <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_8rem]">
                <FormField
                  label="Nom de l'option"
                  htmlFor={`options.${index}.name`}
                  error={errors.options?.[index]?.name?.message}
                >
                  <Input id={`options.${index}.name`} {...register(`options.${index}.name`)} />
                </FormField>
                <FormField
                  label="Prix (€)"
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
              <div className="flex items-start gap-1 pt-6">
                <IconButton
                  type="button"
                  label="Monter l'option"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  type="button"
                  label="Descendre l'option"
                  onClick={() => move(index, index + 1)}
                  disabled={index === fields.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  type="button"
                  label="Supprimer l'option"
                  variant="danger"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
            <FormField
              label="Description"
              htmlFor={`options.${index}.description`}
              className="mt-3 pl-7"
            >
              <Textarea
                id={`options.${index}.description`}
                rows={2}
                {...register(`options.${index}.description`)}
              />
            </FormField>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ selected: false, name: "", description: "", price: 0 })}
      >
        <Plus className="h-4 w-4" />
        Ajouter une option
      </Button>
    </SectionCard>
  );
}
