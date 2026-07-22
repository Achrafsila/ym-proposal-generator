"use client";

import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import type { ProposalFormValues } from "@/lib/proposal-schema";

export function TermsSection() {
  const { register } = useFormContext<ProposalFormValues>();

  return (
    <SectionCard title="Conditions commerciales">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Délai de réalisation" htmlFor="terms.completionTime">
          <Input
            id="terms.completionTime"
            placeholder="ex. 6 à 8 semaines"
            {...register("terms.completionTime")}
          />
        </FormField>
        <FormField label="Nombre de modifications incluses" htmlFor="terms.revisionsIncluded">
          <Input
            id="terms.revisionsIncluded"
            placeholder="ex. 2 séries de modifications"
            {...register("terms.revisionsIncluded")}
          />
        </FormField>
        <FormField label="Durée de l'hébergement" htmlFor="terms.hostingDuration">
          <Input
            id="terms.hostingDuration"
            placeholder="ex. 1 an inclus"
            {...register("terms.hostingDuration")}
          />
        </FormField>
        <FormField label="Maintenance et support" htmlFor="terms.maintenanceSupport">
          <Input
            id="terms.maintenanceSupport"
            placeholder="ex. support par email pendant 30 jours"
            {...register("terms.maintenanceSupport")}
          />
        </FormField>
      </div>
      <FormField label="Modalités de paiement" htmlFor="terms.paymentTerms">
        <Textarea id="terms.paymentTerms" rows={2} {...register("terms.paymentTerms")} />
      </FormField>
      <FormField label="Remarques complémentaires" htmlFor="terms.additionalNotes">
        <Textarea id="terms.additionalNotes" rows={3} {...register("terms.additionalNotes")} />
      </FormField>
    </SectionCard>
  );
}
